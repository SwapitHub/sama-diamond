import React, { useEffect } from 'react';


const NewsLetter = ({targetId}) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = '//js.hsforms.net/forms/shell.js';
    document.body.appendChild(script);

    script.onload = () => {
      if (window.hbspt) {
        window.hbspt.forms.create({
          portalId: '45427602',
          formId: '5ada63ac-16ec-4ecb-bca7-21caf983c404',
          target: `#${targetId}`
        });
      }
    };
  }, []);

  return <div id={targetId}></div>;
};

export default NewsLetter;
