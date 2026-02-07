interface RichTextRendererProps {
  content: string;
  className?: string;
}

export const RichTextRenderer = ({ content, className = '' }: RichTextRendererProps) => {
  return (
    <div 
      className={`zorunlu-content ${className}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};
