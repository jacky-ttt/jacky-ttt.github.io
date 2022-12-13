import * as React from "react"
import type { HeadFC } from "gatsby"
import websiteConfig from "../config/config"

type BigTitleProps = {
  children: React.ReactNode,
};
export const BigTitle = ({ children }: BigTitleProps) => (<h1 className="text-5xl lg:text-6xl font-sans font-medium text-white mb-6 tracking-wide">
  {children}
</h1>)

type SubtitleProps = {
  children: JSX.Element | string,
};
export const Subtitle = ({ children }: SubtitleProps) => (<h1 className="text-2xl lg:text-4xl font-sans text-white mt-8 xxl:w-3/4">
  {children}
</h1>)

type ProjectCardProps = {
  title: string
  subtitle: string
  link: string
  gradientBg: string
}
const ProjectCard = ({ title, subtitle, link, gradientBg }: ProjectCardProps) => (
  <a href={link} target="_blank" rel="noopener noreferrer"
    className={`w-full block shadow-lg relative no-underline rounded-lg px-8 py-8 md:py-24 text-white hover:duration-200 hover:animate-pulse hover:skew-x-1 ${gradientBg}`} >
    <div className="text-white uppercase text-2xl md:text-3xl xl:text-4xl tracking-wide font-mono">{title}</div>
    <div className="opacity-75 font-sans text-sm md:text-base">{subtitle}</div>
  </a>
)

const projects = [
  {
    name: 'Life of A Jacky',
    year: '2022',
    description: 'NFT that records daily journals encrypted with aes256',
    skill: 'typescript, hardhat',
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-01.jpg',
  },
  {
    name: 'Cruzr',
    year: '2017',
    description: 'A navigation app that lives on a robot',
    skill: 'Google Cloud Speech-to-Text, DialogFlow and Google Text-to-speech',
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-02.jpg',
  },
  {
    name: 'Stay focused',
    year: '2017',
    description: 'Interactive 3D model viewer',
    skill: 'React Native, Javascript, three.js',
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-03.jpg',
  },
  {
    name: 'Web Scrapper',
    year: '2017',
    description: 'Automated web scrapper',
    skill: 'Python, Scrapy, selenium, Beautiful Soup, Javascript, Puppeteer, Playwright',
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
    skill: 'Javascript, Electron, ag-grid',
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


const IndexPage = () => {
  return (
    <main className="w-full p-12 md:p-24 lg:p-36 justify-center items-center flex z-50">
      <div className="w-full xl:w-2/3">
        <BigTitle>
          Hello, <br /> I'm Tsang Sze Chun.
        </BigTitle>
        <Subtitle>
          Android Developer. Blogger.😊
        </Subtitle>

        <div className="grid grid-rows-2 xl:grid-rows-1 xl:grid-cols-2 gap-4 mt-20">
          <ProjectCard
            title="GitHub"
            subtitle="A developer needs a Github to support him somewhere in his life."
            link="https://github.com/jacky-ttt/"
            gradientBg="bg-gradient-to-r from-blue-800 to-cyan-500" />
          <ProjectCard
            title="Medium"
            subtitle="I post articles on Medium now and then. Mostly about the dev I used in my work."
            link="https://jacky-ttt.medium.com/"
            gradientBg="bg-gradient-to-r from-violet-800 to-fuchsia-500" />
        </div>

        <p className="mt-20 mb-4 text-2xl font-sans text-white">Projects</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {projects.map((project, index) => (
            <div key={index} className="group bg-gradient-to-r from-red-900 to-orange-500 rounded-lg overflow-hidden hover:duration-200 hover:skew-x-1">
              <div className="mx-4 my-4">
                <h3 className="text-lg font-sans font-medium text-white">{project.name}</h3>
                <p className="text-sm font-sans font-light text-white">{project.year}</p>
                <p className="mt-2 text-sm font-sans font-light text-white">{project.description}</p>
              </div>
            </div>
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
