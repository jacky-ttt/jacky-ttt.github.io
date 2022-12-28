import * as React from "react"
import type { HeadFC } from "gatsby"
import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import websiteConfig from "../config/config"
import { graphql, useStaticQuery } from "gatsby"
import { GatsbyImage, getImage, ImageDataLike } from "gatsby-plugin-image"
import { XMarkIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid'
import { IoLogoGithub } from 'react-icons/io'
import { links } from "../data/links"
import { skills } from "../data/skills"
import { getBgColors } from "../color/backgroundColor"

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
      className={`w-full h-full block shadow-lg relative no-underline rounded-lg px-8 py-8 lg:py-24 text-white group-hover:animate-pulse preserve-3d group-hover:rotate3d-x-10 2xl:group-hover:rotate3d-x-5 duration-200 bg-gradient-to-r ${gradientBg}`} >
      <div className={`w-full h-full `}>
        <div className="flex items-center">
          <div className="text-white uppercase text-2xl md:text-3xl xl:text-4xl tracking-wide font-mono">{title}</div>
          <ArrowTopRightOnSquareIcon className="h-6 w-6 text-neutral-100/80 ml-1 sm:ml-2 collapse group-hover:visible duration-2000" aria-hidden="true" />
        </div>
        <div className="opacity-75 font-sans text-sm md:text-base">{subtitle}</div>
      </div>
    </a>
  </div>
)


type ProjectData = { name: string; year: string; description: string; skill: string; image: ImageDataLike, fullImage: ImageDataLike }
const INVALID_PROJECT_ID = -1
type ProjectCardProps = {
  id: number
  title: string
  subtitle: string
  description: string
  backDescription: string
  bgColor: string
  image: ImageDataLike
  setOpen: React.Dispatch<React.SetStateAction<number>>
}
const ProjectCard = ({ id, title, subtitle, description, backDescription, bgColor, image, setOpen }: ProjectCardProps) => {
  const checkId = (current: number): number => {
    if (current == id) {
      return INVALID_PROJECT_ID
    } else {
      return id
    }
  }
  const onClickHandler = () => { setOpen(current => checkId(current)) }
  return (
    <div className="group perspective cursor-pointer" onClick={onClickHandler}>
      {/* <div className="relate w-full h-full preserve-3d group-hover:rotate3d-x-180 duration-500">
        <div className={`w-full h-full rounded-lg overflow-hidden translate3d-z-20`} style={{ backgroundColor: bgColor }}>
          <GatsbyImage className="bg-neutral-500 before:bg-black/80 before:absolute before:inset-0 before:z-10" image={getImage(image)} alt={title} />
          <div className="px-4 py-4">
            <h3 className="text-lg uppercase font-mono font-medium text-white">{title}</h3>
            <p className="text-sm font-sans font-light text-white">{subtitle}</p>
            <p className="mt-4 text-sm font-sans font-light text-white">{description}</p>
          </div>
        </div>
        <div className="absolute inset-0 flex items-center rounded-lg bg-black/90 px-4 py-4 text-slate-200 rotate3d-x-180 backface-hidden overflow-hidden">
          <p className="text-sm font-sans font-light text-white">{backDescription}</p>
        </div>
      </div> */}
      <div className={`w-full h-full shadow-lg rounded-lg overflow-hidden group-hover:rotate3d-x-10 2xl:group-hover:rotate3d-x-5 duration-200`} style={{ backgroundColor: bgColor }}>
        <GatsbyImage className="bg-neutral-500 before:bg-black/80 before:absolute before:inset-0 before:z-10" image={getImage(image)} alt={title} />
        <div className="px-4 py-4">
          <h3 className="text-lg uppercase font-mono font-medium text-white">{title}</h3>
          <p className="text-sm font-sans font-light text-white leading-3">{subtitle}</p>
          <p className="mt-4 text-sm font-sans text-white/80">{description}</p>
        </div>
      </div>
    </div>
  )
}




type SkillCardProps = {
  name: string
  bgColor: string
}
const SkillCard = ({ name, bgColor }: SkillCardProps) => {
  return (
    <div
      className="rounded-lg bg-violet-800 leading-5 font-mono uppercase text-sm md:text-base px-4 py-2 hover:scale-110 duration-200"
      style={{ backgroundColor: bgColor }}>{name}</div>
  )
}


type ProjectModalProps = {
  project: ProjectData | undefined
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<number>>
}
const Modal = ({ project, open, setOpen }: ProjectModalProps) => {
  const onCloseHandler = () => setOpen(INVALID_PROJECT_ID)
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onCloseHandler}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-neutral-800 shadow-xl transition-all w-full max-w-4xl">
                <div>
                  <div className="absolute inset-0 z-10 ml-auto mt-4 mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-900/60 cursor-pointer" onClick={onCloseHandler}>
                    <XMarkIcon className="h-6 w-6 text-neutral-100/80" aria-hidden="true" />
                  </div>
                  {project != undefined && getImage(project.fullImage) &&
                    <GatsbyImage className="bg-neutral-500" image={getImage(project.fullImage)} alt={project.name} />}

                  <div className="my-6 sm:w-96 justify-center mx-auto">
                    <Dialog.Title as="h3" className="text-3xl uppercase font-mono font-medium text-white">
                      {project?.name ?? ""}
                    </Dialog.Title>
                    <p className="text-sm sm:text-base font-sans font-light text-white leading-3">
                      {project?.year ?? ""}
                    </p>
                    <p className="text-base sm:text-lg font-sans font-light text-white mt-6">
                      {project?.description ?? ""}
                    </p>
                    <p className="text-base sm:text-lg font-sans font-light text-white mt-4">
                      {project?.skill ?? ""}
                    </p>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
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
              layout: FULL_WIDTH
              aspectRatio: 2
              transformOptions: {cropFocus: ATTENTION}
            )
          }
        }
        fullImage: image {
          childImageSharp {
            gatsbyImageData(
              placeholder: BLURRED
              formats: [AUTO, WEBP, AVIF]
              layout: FULL_WIDTH
            )
          }
        }
      }
    }
  }
`


const IndexPage = () => {
  const [selectedProjectId, setSelectedProjectId] = useState(INVALID_PROJECT_ID)

  const projectsData = useStaticQuery(projectsQuery)
  const projects = projectsData.allProjectsJson.nodes

  const linkBgColors = [
    "from-blue-800 to-cyan-500",
    "from-neutral-800 to-zinc-500",
    "from-green-800 to-emerald-500",
  ]
  const skillPillBgColors = getBgColors(skills, "#5b21b6", "#d946ef")
  const bgColors = getBgColors(projects, "#7f1d1d", "#ea580c")

  return (
    <main className="w-full p-12 md:p-24 lg:p-36 justify-center items-center flex">
      <div className="w-full xl:w-[88rem]">
        <div className="animate-in fade-in slide-in-from-top-14 duration-1000">
          <BigTitle>
          </BigTitle>
          <Subtitle>
            Android Developer. Blogger.😊
          </Subtitle>
        </div>

        <div className="grid lg:grid-rows-1 lg:grid-cols-3 gap-4 mt-20 animate-in fade-in slide-in-from-top-10 duration-1000">
          {links.map((link, index: number) =>
            <LinkCard
              key={index}
              title={link.name}
              subtitle={link.description}
              link={link.link}
              gradientBg={linkBgColors[index]} />
          )}
        </div>

        <div className="animate-in fade-in slide-in-from-top-6 duration-1000">
          <p className="mt-20 mb-4 text-2xl font-sans text-white">Skills</p>
          <div className="flex flex-wrap gap-2 sm:gap-3 text-white">
            {skills.map((skill: string, index: number) =>
              <SkillCard key={index} name={skill} bgColor={skillPillBgColors[index]} />
            )}
          </div>
        </div>

        <div className="animate-in fade-in slide-in-from-top-6 duration-1000">
          <p className="mt-20 mb-4 text-2xl font-sans text-white">Projects</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {projects.map((project: ProjectData, index: number) => (
              <ProjectCard
                key={index}
                id={index}
                title={project.name}
                subtitle={project.year}
                description={project.description}
                backDescription={project.skill}
                image={project.image}
                bgColor={bgColors[index]}
                setOpen={setSelectedProjectId}
              />
            ))}
          </div>
        </div>

        <div className="mt-20 flex">
          <a href={"https://github.com/jacky-ttt/jacky-ttt.github.io/tree/dev"} target="_blank" rel="noopener noreferrer"
            className={`mx-auto text-base sm:text-lg lg:text-xl no-underline rounded-lg text-white/80`} >
            <IoLogoGithub className="inline mr-1" />source
          </a>
        </div>

        <Modal
          project={projects[selectedProjectId]}
          open={selectedProjectId != INVALID_PROJECT_ID}
          setOpen={setSelectedProjectId}
        />
      </div>
    </main>
  )
}

export default IndexPage

export const Head: HeadFC = () => {
  return (
    <>
      <title>{websiteConfig.siteTitle}</title>
      <meta name="description" content={websiteConfig.siteDescription} />
      <meta property="og:title" content={websiteConfig.siteTitle} />
      <meta property="og:url" content={websiteConfig.siteUrl} />
      <meta property="og:description" content={websiteConfig.siteDescription} />
      <meta property="og:type" content="website" />
    </>
  )
}
