import * as React from "react"
import type { HeadFC } from "gatsby"
import websiteConfig from "../config/config"
import { graphql, useStaticQuery } from "gatsby"
import { StaticImage, GatsbyImage, getImage, IGatsbyImageData, ImageDataLike } from "gatsby-plugin-image"

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
      className={`w-full h-full block shadow-lg relative no-underline rounded-lg px-8 py-8 lg:py-24 text-white group-hover:animate-pulse preserve-3d group-hover:rotate3d-x-10 2xl:group-hover:rotate3d-x-5 duration-200 ${gradientBg}`} >
      <div className={`w-full h-full `}>
        <div className="text-white uppercase text-2xl md:text-3xl xl:text-4xl tracking-wide font-mono">{title}</div>
        <div className="opacity-75 font-sans text-sm md:text-base">{subtitle}</div>
      </div>
    </a>
  </div>
)

const getBgColors = (projects): [string] => {
  return projects.map((project, index: number) => {
    const percentage = Math.pow(index / (projects.length - 1), 2)

    const { r: startColorR, g: startColorG, b: startColorB } = getRGBColor("#7f1d1d")
    const { r: endColorR, g: endColorG, b: endColorB } = getRGBColor("#ea580c")

    const bgColorRed: number = Math.floor(startColorR + percentage * Math.abs((startColorR - endColorR)))
    const bgColorGreen: number = Math.floor(startColorG + percentage * Math.abs((startColorG - endColorG)))
    const bgColorBlue: number = Math.floor(startColorB + percentage * Math.abs((startColorB - endColorB)))
    const newBgColor: string = `#${bgColorRed.toString(16) + bgColorGreen.toString(16) + bgColorBlue.toString(16)}`

    return newBgColor
  })
}

const getRGBColor = (hex: string) => {
  let color = hex.replace(/#/g, "")
  // rgb values
  var r = parseInt(color.substring(0, 2), 16)
  var g = parseInt(color.substring(2, 4), 16)
  var b = parseInt(color.substring(4, 6), 16)

  return { r, g, b }
}

type ProjectCardProps = {
  title: string
  subtitle: string
  description: string
  backDescription: string
  bgColor: string
  image: ImageDataLike
}
const ProjectCard = ({ title, subtitle, description, backDescription, bgColor, image }: ProjectCardProps) => {
  console.log(image);

  return (
    <div className="group cursor-pointer">
      <div className="relate w-full h-full preserve-3d group-hover:rotate3d-x-180 duration-500">
        <div className={`w-full h-full rounded-lg overflow-hidden translate3d-z-20`} style={{ backgroundColor: bgColor }}>
          <GatsbyImage image={getImage(image)} alt={title} />
          <div className="px-4 py-4">
            <h3 className="text-lg uppercase font-mono font-medium text-white">{title}</h3>
            <p className="text-sm font-sans font-light text-white">{subtitle}</p>
            <p className="mt-4 text-sm font-sans font-light text-white">{description}</p>
          </div>
        </div>
        <div className="absolute inset-0 flex items-center rounded-lg bg-black/90 px-4 py-4 text-slate-200 rotate3d-x-180 backface-hidden overflow-hidden">
          <p className="text-sm font-sans font-light text-white">{backDescription}</p>
        </div>
      </div>
    </div>
  )
}

const projectsQuery = graphql`
  query Projects {
    allProjectsJson {
      nodes {
        name
        year
        description
        skill
        image {
          childImageSharp {
            gatsbyImageData(
              placeholder: BLURRED
              formats: [AUTO, WEBP, AVIF]
            )
          }
        }
      }
    }
  }
`

const IndexPage = () => {
  const projectsData = useStaticQuery(projectsQuery)
  // console.log(projectsData);
  // console.log(projectsData.allProjectsJson.nodes[0].image);
  // const imageSrc = getImage(projectsData.allProjectsJson.nodes[1].image)

  const projects = projectsData.allProjectsJson.nodes

  const bgColors = getBgColors(projects)

  return (
    <main className="w-full p-12 md:p-24 lg:p-36 justify-center items-center flex z-50">
      <div className="w-full xl:w-[88rem]">
        <div className="animate-in fade-in slide-in-from-top-14 duration-1000">
          <BigTitle>
          </BigTitle>
          <Subtitle>
            Android Developer. Blogger.😊
          </Subtitle>
        </div>

        <div className="grid lg:grid-rows-1 lg:grid-cols-3 gap-4 mt-20 animate-in fade-in slide-in-from-top-10 duration-1000">
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

        <div className="animate-in fade-in slide-in-from-top-6 duration-1000">
          <p className="mt-20 mb-4 text-2xl font-sans text-white">Projects</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {projects.map((project, index: number) => (
              <ProjectCard
                key={index}
                title={project.name}
                subtitle={project.year}
                description={project.description}
                backDescription={project.skill}
                image={project.image}
                bgColor={bgColors[index]} />
            ))}
          </div>
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
