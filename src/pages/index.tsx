import * as React from "react"
import type { HeadFC } from "gatsby"
import websiteConfig from "../config/config"

type BigTitleProps = {
  children: React.ReactNode,
};
export const BigTitle = ({ children }: BigTitleProps) => (<h1 className="text-5xl lg:text-6xl font-sans font-medium text-white mb-6 tracking-wide">
  <div>Hello,</div>
  <div className="inline sm:inline-block whitespace-pre">I'm </div>
  <div className="inline sm:inline-block text-shadow-white duration-500 hover:text-shadow-blue hover:scale-105 hover:cursor-pointer">Tsang Sze Chun</div>.
  {children}
</h1>)

type SubtitleProps = {
  children: JSX.Element | string,
};
export const Subtitle = ({ children }: SubtitleProps) => (<h1 className="text-2xl lg:text-4xl font-sans text-white mt-8 xxl:w-3/4">
  {children}
</h1>)

type LinkCardProps = {
  title: string
  subtitle: string
  link: string
  gradientBg: string
}
const LinkCard = ({ title, subtitle, link, gradientBg }: LinkCardProps) => (
  <div className="group perspective cursor-pointer">
    <a href={link} target="_blank" rel="noopener noreferrer"
      // `w-full block shadow-lg relative no-underline rounded-lg px-8 py-8 md:py-24 text-white hover:duration-200 hover:animate-pulse hover:skew-x-1 ${gradientBg}`
      className={`w-full block shadow-lg relative no-underline rounded-lg px-8 py-8 md:py-24 text-white group-hover:animate-pulse preserve-3d group-hover:rotate3d-x-10 2xl:group-hover:rotate3d-x-5 duration-200 ${gradientBg}`} >
      <div className={`w-full h-full `}>
        <div className="text-white uppercase text-2xl md:text-3xl xl:text-4xl tracking-wide font-mono">{title}</div>
        <div className="opacity-75 font-sans text-sm md:text-base">{subtitle}</div>
      </div>
    </a>
  </div>
)

const projects = [
  {
    name: 'HSBC',
    year: '2022',
    description: 'International payment module of HSBC mobile banking application',
    skill: 'Android, kotlin, Coroutines, MVP, MVVM, Retrofit, Jenkins, SonarQube',
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-01.jpg',
  },
  {
    name: 'Daily Journal',
    year: '2022',
    description: 'On-chain NFT that holds daily journals',
    skill: 'Typescript, Solidity, Hardhat, Serverless, Ethers.js, AWS lambda',
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-01.jpg',
  },
  {
    name: 'Hase',
    year: '2019',
    description: 'Hong Kong Hang Seng Bank application',
    skill: 'Android, Kotlin, MVP, Retrofit',
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-01.jpg',
  },
  {
    name: 'Cruzr',
    year: '2019',
    description: 'A navigation app that lives on a robot',
    skill: 'Google Cloud speech-to-text, DialogFlow, Google text-to-speech',
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-02.jpg',
  },
  {
    name: 'Stay focused',
    year: '2019',
    description: 'Interactive 3D model viewer',
    skill: 'React Native, Expo, Javascript, Three.js',
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-03.jpg',
  },
  {
    name: 'Volumetric lighting',
    year: '2018',
    description: 'Artistic visualization installation',
    skill: 'C++, OpenCV, VTK, Rhinoceros 3D',
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-04.jpg',
  },
  {
    name: 'Web Scrapper',
    year: '2017',
    description: 'Automated web scrapper',
    skill: 'Python, Scrapy, Selenium, Beautiful Soup, Javascript, Puppeteer, Playwright',
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-04.jpg',
  },
  {
    name: 'Greyed out',
    year: '2015',
    description: 'Android all grey icon pack',
    skill: 'Android, Java',
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-04.jpg',
  },
  {
    name: 'HKJC data grid',
    year: '2015',
    description: 'Data visualization desktop application',
    skill: 'Javascript, Electron, Ag-grid',
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-04.jpg',
  },
  {
    name: 'HK G-Share',
    year: '2014',
    description: 'Second hand trading platform',
    skill: 'Android, Java',
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-04.jpg',
  },
  {
    name: 'UNI Match',
    year: '2014',
    description: 'Networking and events promotion platform exclusively for universities',
    skill: 'Android, Java',
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-04.jpg',
  },
]

const getRGBColor = (hex: string) => {
  let color = hex.replace(/#/g, "")
  // rgb values
  var r = parseInt(color.substring(0, 2), 16)
  var g = parseInt(color.substring(2, 4), 16)
  var b = parseInt(color.substring(4, 6), 16)

  return { r, g, b }
}

const bgColor = projects.map((project, index) => {
  const percentage = Math.pow(index / (projects.length - 1), 2)

  const { r: startColorR, g: startColorG, b: startColorB } = getRGBColor("#7f1d1d")
  const { r: endColorR, g: endColorG, b: endColorB } = getRGBColor("#ea580c")

  const bgColorRed: number = Math.floor(startColorR + percentage * Math.abs((startColorR - endColorR)))
  const bgColorGreen: number = Math.floor(startColorG + percentage * Math.abs((startColorG - endColorG)))
  const bgColorBlue: number = Math.floor(startColorB + percentage * Math.abs((startColorB - endColorB)))
  const newBgColor: string = `#${bgColorRed.toString(16) + bgColorGreen.toString(16) + bgColorBlue.toString(16)}`

  return newBgColor
})

type ProjectCardProps = {
  title: string
  subtitle: string
  description: string
  backDescription: string
  bgColor: string
}
const ProjectCard = ({ title, subtitle, description, backDescription, bgColor }: ProjectCardProps) => {
  return (
    <div className="group perspective cursor-pointer">
      <div className="relate w-full h-full preserve-3d group-hover:rotate3d-x-180 duration-500">
        <div className={`h-full rounded-lg overflow-hidden px-4 py-4`} style={{ backgroundColor: bgColor }}>
          <h3 className="text-lg uppercase font-mono font-medium text-white">{title}</h3>
          <p className="text-sm font-sans font-light text-white">{subtitle}</p>
          <p className="mt-4 text-sm font-sans font-light text-white">{description}</p>
        </div>
        <div className="absolute -inset-px flex items-center rounded-lg bg-black/90 px-4 py-4 text-slate-200 rotate3d-x-180 backface-hidden overflow-hidden">
          <p className="text-sm font-sans font-light text-white">{backDescription}</p>
        </div>
      </div>
    </div>
  )
}


const IndexPage = () => {
  return (
    <main className="w-full p-12 md:p-24 lg:p-36 justify-center items-center flex z-50">
      <div className="w-full xl:w-[88rem]">
        <BigTitle>
        </BigTitle>
        <Subtitle>
          Android Developer. Blogger.😊
        </Subtitle>

        <div className="grid grid-rows-2 xl:grid-rows-1 xl:grid-cols-3 gap-4 mt-20">
          <LinkCard
            title="LinkedIn"
            subtitle="There records my career path, my skills, my language, my whole."
            link="https://www.linkedin.com/in/jacky-tsang-93646a193/"
            gradientBg="bg-gradient-to-r from-blue-800 to-cyan-500" />
          <LinkCard
            title="GitHub"
            subtitle="A developer needs a Github to support him somewhere in his life."
            link="https://github.com/jacky-ttt/"
            gradientBg="bg-gradient-to-r from-violet-800 to-fuchsia-500" />
          <LinkCard
            title="Medium"
            subtitle="I post articles on Medium now and then. Mostly about the dev I used in my work."
            link="https://jacky-ttt.medium.com/"
            gradientBg="bg-gradient-to-r from-green-800 to-emerald-500" />
        </div>

        <p className="mt-20 mb-4 text-2xl font-sans text-white">Projects</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {projects.map((project, index) => (
            <ProjectCard
              key={index}
              title={project.name}
              subtitle={project.year}
              description={project.description}
              backDescription={project.skill}
              bgColor={bgColor[index]} />
          ))}
        </div>
      </div>
    </main>
  )
}

export default IndexPage

export const Head: HeadFC = () => {
  const imageUrl = `${websiteConfig.siteUrl}${websiteConfig.siteLogo}`

  return (
    <>
      <title>{websiteConfig.siteTitle}</title>
      <meta name="description" content={websiteConfig.siteDescription} />
      <meta name="image" content={imageUrl} />
      <meta property="og:title" content={websiteConfig.siteTitle} />
      <meta property="og:url" content={websiteConfig.siteUrl} />
      <meta property="og:description" content={websiteConfig.siteDescription} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:image:alt" content={websiteConfig.siteDescription} />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png" />
      <link rel="shortcut icon" href="/favicon.ico" />
    </>
  )
}
