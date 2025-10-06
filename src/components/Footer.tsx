import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="text-right text-sm text-[#666666] opacity-60">
      <p>
        由 
        <a 
          href="https://github.com/Ahhhh2016" 
          className="text-[#333333] hover:underline font-medium"
          target="_blank"
          rel="noopener noreferrer"
        >
          Ahhhh2016
        </a> 制作，
        希望这个小工具对你有帮助
      </p>
      <p>
        使用Github model免费模型，有使用限制
      </p>
      <p id="busuanzi_container_page_pv">
        已经帮 <span id="busuanzi_value_page_pv">-</span> 位朋友制定了健身计划👀
      </p>
    </footer>
  );
};
