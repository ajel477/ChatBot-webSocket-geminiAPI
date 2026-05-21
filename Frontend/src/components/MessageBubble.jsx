function MessageBubble({ role, content }) {

  const isUser = role === "user";

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
          whitespace-pre-wrap
          shadow-lg
          border
          transition

          ${isUser
            ? `
              bg-white
              text-black
              border-white
              rounded-br-md
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
        {content}
      </div>

    </div>
  );
}

export default MessageBubble;