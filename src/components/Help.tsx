import React, { useEffect, useState } from 'react'
import marked from "marked";
interface HelpProps {

}

export const Help: React.FC<HelpProps> = ({}) => {
    const [markdown,setMarkdown] = useState("")
    useEffect(()=>{
        fetch("https://raw.githubusercontent.com/bunsenstraat/remix-storage-plugin/master/README.md").then(response => {
            return response.text()
          })
          .then(text => {
            setMarkdown(text)
          })
    },[])
    return (
        <section>
          <article dangerouslySetInnerHTML={{__html: marked(markdown)}}></article>
        </section>
      )
}