'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { useCallback, useEffect, useRef } from 'react';
import { uploadContentImage } from '@/lib/content-upload.service';
import { toast } from '@/lib/toast';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
  disabled?: boolean;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Nhập nội dung...',
  minHeight = '240px',
  disabled = false,
}: RichTextEditorProps): JSX.Element {
  const isInternalUpdate = useRef(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        inline: false,
        allowBase64: false,
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: value || '',
    immediatelyRender: false,
    editable: !disabled,
    editorProps: {
      attributes: {
        class:
          'min-h-[120px] px-3 py-2 focus:outline-none [&_h2]:text-lg [&_h2]:font-bold [&_h3]:text-base [&_h3]:font-semibold [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_blockquote]:border-l-4 [&_blockquote]:border-muted-foreground [&_blockquote]:pl-4 [&_blockquote]:italic [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded',
      },
      handleDrop: (view, event) => {
        const files = event.dataTransfer?.files;
        if (files?.length && files[0].type.startsWith('image/')) {
          event.preventDefault();
          handleImageUpload(files[0]).then((url) => {
            if (url) {
              editor?.chain().focus().setImage({ src: url }).run();
            }
          });
          return true;
        }
        return false;
      },
      handlePaste: (view, event) => {
        const items = event.clipboardData?.items;
        if (items) {
          for (const item of Array.from(items)) {
            if (item.type.startsWith('image/')) {
              event.preventDefault();
              const file = item.getAsFile();
              if (file) {
                handleImageUpload(file).then((url) => {
                  if (url) {
                    editor?.chain().focus().setImage({ src: url }).run();
                  }
                });
              }
              return true;
            }
          }
        }
        return false;
      },
    },
  });

  const handleImageUpload = useCallback(async (file: File): Promise<string | null> => {
    try {
      const url = await uploadContentImage(file);
      return url;
    } catch (err) {
      toast.error((err as Error).message || 'Upload ảnh thất bại');
      return null;
    }
  }, []);

  useEffect(() => {
    if (!editor) return;
    const handleUpdate = () => {
      if (!isInternalUpdate.current) {
        const html = editor.getHTML();
        onChange(html === '<p></p>' ? '' : html);
      }
    };
    editor.on('update', handleUpdate);
    return () => editor.off('update', handleUpdate);
  }, [editor, onChange]);

  useEffect(() => {
    if (!editor) return;
    if (value !== editor.getHTML()) {
      isInternalUpdate.current = true;
      editor.commands.setContent(value || '', false);
      isInternalUpdate.current = false;
    }
  }, [value, editor]);

  useEffect(() => {
    editor?.setEditable(!disabled);
  }, [editor, disabled]);

  const addImage = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg,image/png,image/webp,image/gif';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const url = await handleImageUpload(file);
        if (url) editor?.chain().focus().setImage({ src: url }).run();
      }
    };
    input.click();
  }, [editor, handleImageUpload]);

  if (!editor) {
    return (
      <div className="rounded-lg border border-input bg-background" style={{ minHeight }}>
        <div className="flex items-center justify-center p-8 text-muted-foreground">
          Đang tải editor...
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-lg border border-input bg-background overflow-hidden"
      style={{ minHeight }}
    >
      {!disabled && (
        <div className="flex flex-wrap gap-1 border-b border-input bg-muted/30 p-2">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive('bold')}
            title="In đậm"
          >
            <strong>B</strong>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive('italic')}
            title="In nghiêng"
          >
            <em>I</em>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            active={editor.isActive('heading', { level: 2 })}
            title="Tiêu đề H2"
          >
            H2
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            active={editor.isActive('heading', { level: 3 })}
            title="Tiêu đề H3"
          >
            H3
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive('bulletList')}
            title="Danh sách"
          >
            •
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive('orderedList')}
            title="Đánh số"
          >
            1.
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            active={editor.isActive('blockquote')}
            title="Trích dẫn"
          >
            "
          </ToolbarButton>
          <ToolbarButton onClick={addImage} title="Chèn ảnh">
            🖼️
          </ToolbarButton>
        </div>
      )}
      <EditorContent editor={editor} />
    </div>
  );
}

function ToolbarButton({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}): JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`rounded px-2 py-1 text-sm font-medium transition-colors ${
        active ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
      }`}
    >
      {children}
    </button>
  );
}
