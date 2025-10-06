import React from 'react';

interface FooterProps {
  language?: 'zh' | 'en';
}

export const Footer: React.FC<FooterProps> = ({ language = 'zh' }) => {
  const translations = {
    zh: {
      madeBy: "由",
      author: "Ahhhh2016",
      madeBySuffix: "制作，",
      helpMessage: "希望这个小工具对你有帮助",
      modelInfo: "使用Github model免费模型，有使用限制",
      statsMessage: "已经帮",
      statsSuffix: "位朋友制定了健身计划👀"
    },
    en: {
      madeBy: "Made by",
      author: "Ahhhh2016",
      madeBySuffix: ",",
      helpMessage: "hope this tool helps you",
      modelInfo: "Using Github model free tier, has usage limits",
      statsMessage: "Already helped",
      statsSuffix: "friends create fitness plans👀"
    }
  };

  const t = translations[language];

  return (
    <footer className="text-right text-xs text-[#666666] opacity-60">
      <p>
        {t.madeBy} 
        <a 
          href="https://github.com/Ahhhh2016" 
          className="text-[#333333] hover:underline font-medium"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t.author}
        </a> {t.madeBySuffix}
        {t.helpMessage}
      </p>
      <p>
        {t.modelInfo}
      </p>
      <p id="busuanzi_container_page_pv">
        {t.statsMessage} <span id="busuanzi_value_page_pv">-</span> {t.statsSuffix}
      </p>
    </footer>
  );
};
