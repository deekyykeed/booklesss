# Placeholder voiceover for an explainer, from Windows' built-in TTS.
#
#   powershell -File scripts/voice-placeholder.ps1 present-value
#
# Reads src/explainers/<slug>/script.json, speaks each beat, and writes:
#   public/explainers/<slug>/voice.wav   the VO track the composition plays
#   src/explainers/<slug>/words.json     [{word,start,end}] in seconds
#
# words.json is the ONLY thing the edit is timed from. When the real footage
# arrives, scripts/words-from-footage.py writes the same file from a Whisper
# transcript and this script is never run again for that explainer.
param([Parameter(Mandatory = $true)][string]$Slug)

$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Speech

$root = Split-Path -Parent $PSScriptRoot
$scriptPath = Join-Path $root "src/explainers/$Slug/script.json"
$outDir = Join-Path $root "public/explainers/$Slug"
$tmp = Join-Path $outDir "_beats"
New-Item -ItemType Directory -Force $tmp | Out-Null

$script = Get-Content $scriptPath -Raw -Encoding UTF8 | ConvertFrom-Json

$RATE = 24000
$LEAD = 0.35   # silence before the first word
$GAP = 0.40    # breath between beats — a real speaker leaves about this

$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
try { $synth.SelectVoice("Microsoft David Desktop") } catch {}
$synth.Rate = 1
$fmt = New-Object System.Speech.AudioFormat.SpeechAudioFormatInfo($RATE, [System.Speech.AudioFormat.AudioBitsPerSample]::Sixteen, [System.Speech.AudioFormat.AudioChannel]::Mono)

$global:progress = New-Object System.Collections.ArrayList
$synth.add_SpeakProgress({ param($s, $e) [void]$global:progress.Add(@($e.Text, $e.AudioPosition.TotalSeconds)) })

# SAPI's word positions are only trustworthy INSIDE a phrase: across a comma or
# a full stop it overstates the pause, and the error compounds down the beat
# (2026-10-09: "ninety one" was stamped after the next beat had started). So
# each phrase is spoken on its own, timed from its real audio length, and the
# pauses between phrases are ours, not SAPI's.
$PAUSE = @{ "," = 0.16; ";" = 0.2; ":" = 0.2; "." = 0.32; "?" = 0.34; "!" = 0.32 }

$words = New-Object System.Collections.ArrayList
$pcm = New-Object System.IO.MemoryStream
function Add-Silence([double]$sec) {
  $n = [int]([Math]::Round($sec * $RATE)) * 2
  $pcm.Write((New-Object byte[] $n), 0, $n)
}
Add-Silence $LEAD
$offset = $LEAD
$i = 0
foreach ($beat in $script.beats) {
  $phrases = [regex]::Matches($beat.say, "[^,.;:?!]+[,.;:?!]*") | ForEach-Object { $_.Value.Trim() } | Where-Object { $_ }
  $p = 0
  foreach ($phrase in $phrases) {
    $wav = Join-Path $tmp ("{0:D2}-{1:D2}.wav" -f $i, $p)
    $global:progress.Clear()
    $synth.SetOutputToWaveFile($wav, $fmt)
    $synth.Speak($phrase)
    $synth.SetOutputToNull()
    $bytes = [System.IO.File]::ReadAllBytes($wav)
    $dur = ($bytes.Length - 44) / ($RATE * 2)

    for ($k = 0; $k -lt $global:progress.Count; $k++) {
      $w = $global:progress[$k][0]
      $t = [Math]::Min($global:progress[$k][1], $dur - 0.05)
      # SAPI reports where a word STARTS; its end is the next word's start or
      # the end of the phrase, capped so trailing silence isn't counted.
      $next = if ($k + 1 -lt $global:progress.Count) { $global:progress[$k + 1][1] } else { $dur }
      $end = [Math]::Min([Math]::Min($next, $dur), $t + 0.7)
      [void]$words.Add([ordered]@{ word = $w; start = [Math]::Round($offset + $t, 3); end = [Math]::Round($offset + $end, 3) })
    }
    $pcm.Write($bytes, 44, $bytes.Length - 44)
    $offset += $dur
    $last = $p -eq $phrases.Count - 1
    $pause = if ($last) { $GAP } else { $PAUSE[[string]$phrase[-1]] }
    if (-not $pause) { $pause = 0.06 }
    Add-Silence $pause
    $offset += $pause
    $p++
  }
  $i++
}
$synth.Dispose()

# One PCM stream -> one WAV. Written by hand so the timing above IS the file:
# no resampling, no concat filter that could round a segment boundary.
$data = $pcm.ToArray()
$out = New-Object System.IO.MemoryStream
$bw = New-Object System.IO.BinaryWriter($out)
$bw.Write([Text.Encoding]::ASCII.GetBytes("RIFF")); $bw.Write([int](36 + $data.Length))
$bw.Write([Text.Encoding]::ASCII.GetBytes("WAVEfmt ")); $bw.Write([int]16); $bw.Write([int16]1); $bw.Write([int16]1)
$bw.Write([int]$RATE); $bw.Write([int]($RATE * 2)); $bw.Write([int16]2); $bw.Write([int16]16)
$bw.Write([Text.Encoding]::ASCII.GetBytes("data")); $bw.Write([int]$data.Length); $bw.Write($data)
[System.IO.File]::WriteAllBytes((Join-Path $outDir "voice.wav"), $out.ToArray())

$json = ConvertTo-Json -InputObject @($words) -Depth 3
[System.IO.File]::WriteAllText((Join-Path $root "src/explainers/$Slug/words.json"), $json, (New-Object System.Text.UTF8Encoding($false)))
Remove-Item -Recurse -Force $tmp

Write-Host ("{0} words, {1:N1}s of voice" -f $words.Count, $offset)
