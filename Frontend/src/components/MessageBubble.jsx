import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

function MessageBubble({ role, content }) {

  const isUser = role === "user";

  const isError = role === "error";

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >

      <div
        className={`
          max-w-[88%] sm:max-w-[75%]
          px-5
          py-4
          rounded-3xl
          text-[15px]
          leading-7
          shadow-lg
          border
          transition
          overflow-hidden

          ${isUser
            ? `
              bg-white
              text-black
              border-white
              rounded-br-md
            `
            : isError
            ? `
              bg-red-900/20
              text-red-400
              border-red-900/50
              rounded-bl-md
            `
            : `
              bg-zinc-900
              text-zinc-100
              border-zinc-800
              rounded-bl-md
            `
          }
        `}
      >

        {isUser ? (

          <p className="whitespace-pre-wrap">
            {content}
          </p>

        ) : (

          <ReactMarkdown

            remarkPlugins={[remarkGfm]}

            components={{

              code({
                inline,
                className,
                children,
                ...props
              }) {

                const match = /language-(\w+)/.exec(
                  className || ""
                );

                return !inline && match ? (

                  <SyntaxHighlighter
                    style={oneDark}
                    language={match[1]}
                    PreTag="div"
                    customStyle={{
                      borderRadius: "16px",
                      padding: "16px",
                      fontSize: "14px",
                      marginTop: "16px",
                      marginBottom: "16px"
                    }}
                    {...props}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>

                ) : (

                  <code
                    className="
                      bg-zinc-800
                      px-1.5
                      py-1
                      rounded
                      text-sm
                    "
                    {...props}
                  >
                    {children}
                  </code>

                );
              },

              h1: ({ children }) => (
                <h1 className="text-3xl font-bold mt-4 mb-3">
                  {children}
                </h1>
              ),

              h2: ({ children }) => (
                <h2 className="text-2xl font-semibold mt-4 mb-3">
                  {children}
                </h2>
              ),

              h3: ({ children }) => (
                <h3 className="text-xl font-semibold mt-4 mb-2">
                  {children}
                </h3>
              ),

              ul: ({ children }) => (
                <ul className="list-disc pl-6 space-y-2 my-3">
                  {children}
                </ul>
              ),

              ol: ({ children }) => (
                <ol className="list-decimal pl-6 space-y-2 my-3">
                  {children}
                </ol>
              ),

              li: ({ children }) => (
                <li className="text-zinc-200">
                  {children}
                </li>
              ),

              p: ({ children }) => (
                <p className="mb-3 last:mb-0">
                  {children}
                </p>
              ),

              blockquote: ({ children }) => (
                <blockquote
                  className="
                    border-l-4
                    border-zinc-600
                    pl-4
                    italic
                    my-4
                    text-zinc-300
                  "
                >
                  {children}
                </blockquote>
              ),

              table: ({ children }) => (
                <div className="overflow-x-auto my-4">
                  <table className="w-full border border-zinc-700">
                    {children}
                  </table>
                </div>
              ),

              th: ({ children }) => (
                <th className="border border-zinc-700 px-3 py-2 bg-zinc-800">
                  {children}
                </th>
              ),

              td: ({ children }) => (
                <td className="border border-zinc-700 px-3 py-2">
                  {children}
                </td>
              )

            }}

          >
            {content}
          </ReactMarkdown>

        )}

      </div>

    </div>
  );
}

export default MessageBubble;