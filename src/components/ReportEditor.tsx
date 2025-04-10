import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const ReportEditor: React.FC = () => {
  const [content, setContent] = useState('');

  return (
    <div className="flex flex-col h-full w-full p-4 bg-gray-100 dark:bg-gray-900">
      <div className="flex-1 overflow-auto rounded-lg shadow border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 max-w-4xl mx-auto">
        <ReactQuill
          theme="snow"
          value={content}
          onChange={setContent}
          placeholder="Start your report here..."
          className="h-full"
        />
      </div>
    </div>
  );
};

export default ReportEditor;