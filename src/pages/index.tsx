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
    name: 'NFT',
    year: '2022',
    description: 'Daily Journal encrypted with sha256',
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-01.jpg',
    imageAlt: 'Daily Journal encrypted with sha256',
  },
  {
    name: 'Cruzr',
    year: '2017',
    description: 'Google Cloud Speech-to-Text, DialogFlow and Google Text-to-speech',
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-02.jpg',
    imageAlt: 'Google Cloud Speech-to-Text, DialogFlow and Google Text-to-speech',
  },
  {
    name: 'Stay focused',
    year: '2017',
    description: 'interactive 3D viewer',
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-03.jpg',
    imageAlt: 'interactive 3D viewer',
  },
  {
    name: 'Web Scrapper',
    year: '2017',
    description: 'Automated web scrapper',
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-04.jpg',
    imageAlt: 'Web Scrapper',
  },
  {
    name: 'Greyed out',
    year: '2015',
    description: 'Android grey icon pack',
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-04.jpg',
    imageAlt: 'Android grey icon pack',
  },
  {
    name: 'HKJC data grid',
    year: '2015',
    description: 'Data visualizator',
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-04.jpg',
    imageAlt: 'Web Scrapper',
  },
  {
    name: 'HK G-Share',
    year: '2014',
    description: 'Second hand trade platform',
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-04.jpg',
    imageAlt: 'Web Scrapper',
  },
  {
    name: 'UNI Match',
    year: '2014',
    description: 'Networking and events promotion platform exclusively for universities',
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-04.jpg',
    imageAlt: 'Web Scrapper',
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

        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8 mt-20">
          {projects.map((project, index) => (
            <div key={index} className="group bg-gradient-to-r from-red-900 to-orange-500 rounded-lg overflow-hidden hover:duration-200 hover:skew-x-1">
              <div className="aspect-w-1 aspect-h-1 w-full xl:aspect-w-7 xl:aspect-h-8">
                <img
                  src={project.imageSrc}
                  alt={project.imageAlt}
                  className="h-full w-full object-cover object-center group-hover:opacity-75"
                />
              </div>
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
