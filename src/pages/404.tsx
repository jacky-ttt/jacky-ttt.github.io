import * as React from "react"
import { Link, HeadFC } from "gatsby"
import { IoHomeOutline } from "react-icons/io5"
import { IoLogoGithub } from "react-icons/io"
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid"

const NotFoundPage = () => {
  return (
    <main className="min-h-screen bg-neutral-800 text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-8 py-16 md:px-16">
        <div className="w-full md:p-12">
          <p className="font-mono text-sm uppercase tracking-[0.22em] text-cyan-300">
            Error 404
          </p>
          <h1 className="mt-4 text-5xl font-medium tracking-wide md:text-6xl">
            Page Not Found
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/75">
            The page you requested does not exist or has been moved. Let&apos;s
            get you back to somewhere useful.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/"
              className="inline-flex h-12 items-center gap-2 rounded-lg bg-gradient-to-r from-blue-800 to-cyan-500 px-5 font-mono leading-none uppercase tracking-wide text-white no-underline shadow-lg duration-200 hover:scale-105"
            >
              <IoHomeOutline className="h-5 w-5" />
              Back Home
            </Link>
            <a
              href="https://github.com/jacky-ttt/jacky-ttt.github.io/tree/dev"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex h-12 items-center rounded-lg border border-white/20 bg-neutral-800/70 px-5 font-mono leading-none uppercase tracking-wide text-white/90 no-underline shadow-lg duration-200 hover:scale-105"
            >
              <IoLogoGithub className="h-5 w-5" />
              <span className="ml-2">Source</span>
              <span className="ml-1 inline-flex w-0 overflow-hidden transition-all duration-200 group-hover:w-4">
                <ArrowTopRightOnSquareIcon className="h-4 w-4" />
              </span>
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}

export default NotFoundPage

export const Head: HeadFC = () => (
  <>
    <title>404 | Page Not Found</title>
    <meta
      name="description"
      content="The page you are looking for cannot be found."
    />
  </>
)
