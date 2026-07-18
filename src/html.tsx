import * as React from "react"

type HtmlProps = {
  body: string
  bodyAttributes: React.HTMLAttributes<HTMLBodyElement>
  headComponents: React.ReactNode[]
  htmlAttributes: React.HtmlHTMLAttributes<HTMLHtmlElement>
  postBodyComponents: React.ReactNode[]
  preBodyComponents: React.ReactNode[]
}

export default function Html({
  body,
  bodyAttributes,
  headComponents,
  htmlAttributes,
  postBodyComponents,
  preBodyComponents,
}: HtmlProps) {
  return (
    <html {...htmlAttributes}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        {headComponents}
        <script
          type="text/javascript"
          src="https://classic.avantlink.com/affiliate_app_confirm.php?mode=js&authResponse=357cc44421e708337dce7d51ed66c4860dc51510"
        />
      </head>
      <body {...bodyAttributes}>
        {preBodyComponents}
        <div id="___gatsby" dangerouslySetInnerHTML={{ __html: body }} />
        {postBodyComponents}
      </body>
    </html>
  )
}
