import { Navbar } from './components/Navbar'
import { ScrollVideo } from './components/ScrollVideo'
import { SectionOne } from './sections/SectionOne'
import { SectionTwo } from './sections/SectionTwo'

export default function App() {
  return (
    <div className="relative">
      <ScrollVideo />
      <div className="relative z-10">
        <Navbar />
        <main>
          <SectionOne />
          <div aria-hidden="true" className="h-[80vh]" />
          <SectionTwo />
        </main>
      </div>
    </div>
  )
}
