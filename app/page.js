"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";

const CHAT_STYLES = [
  {
    id: "friendly",
    name: "Thân thiện",
    gradient: "from-aurora-green to-aurora-blue",
    headline: "Ấm áp, gần gũi, nhiều năng lượng tích cực.",
    guidelines: [
      "Chào hỏi bằng tên hoặc đại từ thân mật.",
      "Dùng emoji vừa phải để tăng cảm xúc.",
      "Phản hồi bằng câu ngắn, dễ đọc."
    ],
    filler: [
      "Hoàn toàn hiểu ý của bạn nè!",
      "Nghe là thấy hứng khởi rồi đó."
    ]
  },
  {
    id: "professional",
    name: "Trang trọng",
    gradient: "from-aurora-blue to-aurora-violet",
    headline: "Rõ ràng, lịch sự, hướng tới giải pháp.",
    guidelines: [
      "Trình bày theo trật tự, ưu tiên bullet.",
      "Tập trung vào dữ liệu, hành động cụ thể.",
      "Giữ thái độ tôn trọng, không dùng tiếng lóng."
    ],
    filler: [
      "Xin phép được trình bày như sau:",
      "Tôi đề xuất bạn cân nhắc các lựa chọn này."
    ]
  },
  {
    id: "witty",
    name: "H dí dỏm",
    gradient: "from-aurora-violet to-aurora-green",
    headline: "Thông minh, tinh nghịch nhưng vẫn đủ sâu sắc.",
    guidelines: [
      "Chơi chữ nhẹ nhàng, tránh gây hiểu lầm.",
      "Đan xen ví von, liên tưởng đời thường.",
      "Chốt lại vẫn hữu ích, không chỉ đùa."
    ],
    filler: [
      "Combo vui vẻ + hữu ích đây!"
    ]
  },
  {
    id: "empathetic",
    name: "Thấu cảm",
    gradient: "from-aurora-green to-aurora-violet",
    headline: "Lắng nghe, phản hồi bằng sự chia sẻ chân thành.",
    guidelines: [
      "Phản chiếu cảm xúc người đối thoại.",
      "Đưa ra bước hỗ trợ nhỏ, dễ thực hiện.",
      "Giữ tốc độ nhẹ nhàng, nhiều khoảng nghỉ."
    ],
    filler: [
      "Mình nghe bạn đang trải qua điều này và rất hiểu cho cảm giác đó."
    ]
  },
  {
    id: "direct",
    name: "Rõ ràng",
    gradient: "from-aurora-blue to-aurora-blue",
    headline: "Đi thẳng vấn đề, ngắn gọn nhưng không cộc lốc.",
    guidelines: [
      "Mỗi câu một ý, tránh dài dòng.",
      "Nêu đáp án ngay đầu đoạn.",
      "Không dùng các cụm mơ hồ."
    ],
    filler: [
      "Tóm gọn như sau:"
    ]
  }
];

const STARTER_PROMPTS = [
  "Viết một lời xin lỗi theo phong cách dí dỏm.",
  "Hướng dẫn mình lên kế hoạch du lịch Đà Lạt kiểu thân thiện.",
  "Chia sẻ cách động viên đồng đội đang quá tải.",
  "Tưởng tượng bạn là chuyên gia, hãy giải thích cho mình đơn giản thôi."
];

function generateResponse(style, message, history) {
  const latestUserMessage = message.trim();
  const recap = history
    .filter((entry) => entry.role === "user")
    .slice(-2)
    .map((entry) => entry.content)
    .join(" • ");

  const baseIntro =
    style.filler[Math.floor(Math.random() * style.filler.length)] ||
    "Cùng xem nhé:";

  const outro =
    style.id === "empathetic"
      ? "Nếu cần thêm gì, mình ở đây lắng nghe."
      : style.id === "witty"
        ? "Thử áp dụng xem, biết đâu bất ngờ!"
        : style.id === "direct"
          ? "Hãy triển khai ngay."
          : "Hy vọng mang lại cho bạn chút cảm hứng.";

  const actionable =
    style.id === "professional" || style.id === "direct"
      ? `• Ưu tiên mục tiêu chính: ${latestUserMessage}\n• Đo lường bằng 1 tiêu chí rõ ràng.\n• Theo dõi và điều chỉnh sau 48 giờ.`
      : style.id === "empathetic"
        ? `• Thử viết xuống điều khiến bạn trăn trở.\n• Chọn một bước nhỏ bạn có thể làm ngay.\n• Nhắn tin cho người bạn tin tưởng để chia sẻ.`
        : style.id === "witty"
          ? `• Gọi tên vấn đề như một nhân vật chính.\n• Tìm một “plot twist” giúp bạn đổi góc nhìn.\n• Kết lại bằng hành động vui bạn làm được liền.`
          : `• Nhìn rõ mong muốn của bạn (${recap || latestUserMessage}).\n• Chia nhỏ thành 2-3 bước nhẹ.\n• Ăn mừng từng bước nhỏ cho đủ năng lượng.`;

  return `${baseIntro}\n\n${latestUserMessage.length < 20 ? "Mình mở rộng thêm chút nhé:" : ""}\n${latestUserMessage}\n\n${actionable}\n\n${outro}`;
}

function Timestamp({ value }) {
  return (
    <span className="text-xs text-slate-400">
      {value.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit"
      })}
    </span>
  );
}

function MessageBubble({ message, isOwn }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={clsx("flex w-full flex-col gap-2", {
        "items-end": isOwn,
        "items-start": !isOwn
      })}
    >
      <div
        className={clsx(
          "glass-panel max-w-[85%] rounded-3xl px-5 py-3 shadow-lg",
          isOwn
            ? "rounded-br-sm border-aurora-blue/50 bg-aurora-blue/20 text-slate-50"
            : "rounded-bl-sm border-white/10 text-slate-200"
        )}
      >
        <p className="whitespace-pre-line leading-relaxed">{message.content}</p>
      </div>
      <Timestamp value={message.timestamp} />
    </motion.div>
  );
}

function StyleCard({ style, isActive, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(style.id)}
      className={clsx(
        "relative w-full rounded-3xl border px-6 py-5 text-left transition",
        "glass-panel hover:border-aurora-green/40 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-aurora-green",
        isActive && "border-aurora-green/60 shadow-aurora-green/30 shadow-[0_0_30px]"
      )}
    >
      <span
        className={clsx(
          "inline-flex h-9 items-center rounded-full bg-gradient-to-r px-4 text-sm font-semibold text-night",
          style.gradient
        )}
      >
        {style.name}
      </span>
      <p className="mt-3 text-sm text-slate-300">{style.headline}</p>
      <ul className="mt-4 space-y-2 text-sm text-slate-400">
        {style.guidelines.map((tip) => (
          <li key={tip} className="flex gap-2">
            <span className="mt-1 text-aurora-green">•</span>
            <span>{tip}</span>
          </li>
        ))}
      </ul>
    </button>
  );
}

export default function Home() {
  const [selectedStyle, setSelectedStyle] = useState(CHAT_STYLES[0].id);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      id: "intro",
      role: "assistant",
      styleId: "friendly",
      content:
        "Xin chào! \"Chat kiểu gì\" là studio nhỏ giúp bạn luyện cách trò chuyện với nhiều phong cách khác nhau. Chọn một phong cách bên trái, đặt câu hỏi hoặc nội dung muốn gửi, rồi cùng xem lời hồi đáp sẽ khác ra sao nhé!",
      timestamp: new Date()
    }
  ]);
  const chatContainerRef = useRef(null);

  const activeStyle = useMemo(
    () => CHAT_STYLES.find((style) => style.id === selectedStyle),
    [selectedStyle]
  );

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) {
      return;
    }

    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      styleId: selectedStyle,
      content: trimmed,
      timestamp: new Date()
    };

    const responseMessage = {
      id: `assistant-${Date.now()}`,
      role: "assistant",
      styleId: selectedStyle,
      content: generateResponse(activeStyle, trimmed, [...messages, userMessage]),
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage, responseMessage]);
    setInput("");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const randomPrompt = () => {
    const suggestion =
      STARTER_PROMPTS[Math.floor(Math.random() * STARTER_PROMPTS.length)];
    setInput(suggestion);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="grid gap-8 lg:grid-cols-[340px,1fr]"
    >
      <section className="flex flex-col gap-6">
        <header>
          <h1 className="text-3xl font-semibold text-white sm:text-4xl">
            Chat kiểu gì?
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            Thử nghiệm giọng điệu hội thoại bằng cách lựa chọn phong cách và đặt
            câu hỏi của riêng bạn. Mỗi phong cách sẽ phản hồi khác nhau để bạn học
            cách điều chỉnh cách trò chuyện.
          </p>
        </header>
        <div className="glass-panel flex flex-col gap-5 rounded-3xl p-5">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-aurora-green">
              Chọn phong cách
            </p>
            <p className="mt-1 text-sm text-slate-400">
              Trải nghiệm xem cùng một nội dung sẽ đổi thành cảm giác thế nào.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            {CHAT_STYLES.map((style) => (
              <StyleCard
                key={style.id}
                style={style}
                isActive={style.id === selectedStyle}
                onSelect={setSelectedStyle}
              />
            ))}
          </div>
        </div>
        <div className="glass-panel rounded-3xl p-5 text-sm text-slate-300">
          <h2 className="text-base font-semibold text-white">
            Cách sử dụng mini-lab
          </h2>
          <ol className="mt-3 space-y-3 text-sm">
            <li className="flex gap-3">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-aurora-green/50 text-xs text-aurora-green">
                1
              </span>
              <span>Chọn phong cách phù hợp với bối cảnh bạn đang hướng tới.</span>
            </li>
            <li className="flex gap-3">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-aurora-green/50 text-xs text-aurora-green">
                2
              </span>
              <span>Đặt câu hỏi, nội dung hoặc đoạn hội thoại bạn muốn luyện.</span>
            </li>
            <li className="flex gap-3">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-aurora-green/50 text-xs text-aurora-green">
                3
              </span>
              <span>Đọc phản hồi, chú ý cách cấu trúc câu và từ ngữ đặc trưng.</span>
            </li>
          </ol>
        </div>
      </section>

      <section className="glass-panel flex h-full flex-col rounded-3xl p-6">
        <header className="flex flex-col gap-1 border-b border-white/10 pb-4 text-sm text-slate-300">
          <span className="text-xs uppercase tracking-[0.3em] text-aurora-blue">
            Phòng chat trải nghiệm
          </span>
          <div className="flex items-center justify-between">
            <p>
              Đang thử:{" "}
              <span className="font-medium text-white">{activeStyle.name}</span>
            </p>
            <button
              type="button"
              onClick={randomPrompt}
              className="rounded-full border border-aurora-blue/50 px-3 py-1 text-xs font-medium text-aurora-blue transition hover:bg-aurora-blue/10"
            >
              Gợi ý câu hỏi
            </button>
          </div>
        </header>

        <div
          ref={chatContainerRef}
          className="mt-4 flex h-[540px] flex-col gap-6 overflow-y-auto pr-2"
        >
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isOwn={message.role === "user"}
              />
            ))}
          </AnimatePresence>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleSend();
          }}
          className="mt-auto flex flex-col gap-3 border-t border-white/10 pt-4"
        >
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Nhập nội dung bạn muốn chat theo phong cách ${activeStyle.name.toLowerCase()}...`}
            className="min-h-[120px] w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-white placeholder:text-slate-500 focus:border-aurora-green/60 focus:outline-none focus:ring-2 focus:ring-aurora-green/20"
          />
          <div className="flex items-center justify-between text-xs text-slate-500">
            <p>Nhấn Enter để gửi. Shift + Enter để xuống dòng.</p>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-aurora-green via-aurora-blue to-aurora-violet px-5 py-2 text-sm font-semibold text-night shadow-lg shadow-aurora-blue/30 transition hover:-translate-y-0.5 hover:shadow-aurora-blue/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-aurora-blue"
            >
              Gửi phản hồi
            </button>
          </div>
        </form>
      </section>
    </motion.div>
  );
}
