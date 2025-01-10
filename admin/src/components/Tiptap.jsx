import { cn } from "@/lib/utils";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextDirection from "tiptap-text-direction";
import {
  Bold,
  Strikethrough,
  Italic,
  List,
  ListOrdered,
  Undo2,
  Redo2,
  Heading1,
  Heading3,
  Heading2,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  const size = 20;

  const options = [
    {
      fnc: () => editor.chain().focus().toggleBold().run(),
      role: "bold",
      icon: <Bold size={size} />,
    },
    {
      fnc: () => editor.chain().focus().toggleItalic().run(),
      role: "italic",
      icon: <Italic size={size} />,
    },
    {
      fnc: () => editor.chain().focus().toggleStrike().run(),
      role: "strike",
      icon: <Strikethrough size={size} />,
    },
    {
      fnc: () => editor.chain().focus().toggleBulletList().run(),
      role: "bulletList",
      icon: <List />,
    },
    {
      fnc: () => editor.chain().focus().toggleOrderedList().run(),
      role: "orderedList",
      icon: <ListOrdered />,
    },
    {
      fnc: () => editor.chain().focus().undo().run(),
      role: "redo",
      icon: <Undo2 />,
    },
    {
      fnc: () => editor.chain().focus().redo().run(),
      role: "undo",
      icon: <Redo2 />,
    },
  ];

  const headingOptions = [
    { level: 1, label: "Heading 1", icon: <Heading1 size={16} /> },
    { level: 2, label: "Heading 2", icon: <Heading2 size={16} /> },
    { level: 3, label: "Heading 3", icon: <Heading3 size={16} /> },
  ];

  const handleValueChange = (value) => {
    editor
      .chain()
      .toggleHeading({ level: Number(value) })
      .run();
  };

  return (
    <div className="button-group flex gap-1">
      {options.map(({ fnc, role, icon }) => (
        <button
          onClick={fnc}
          key={role}
          className={editor.isActive(role) ? "text-zinc-950" : "text-zinc-500"}
          type="button"
          title={role}
        >
          {icon}
        </button>
      ))}

      <div className="grid gap-1">
        <Select onValueChange={handleValueChange}>
          <SelectTrigger className="h-8">
            <SelectValue placeholder="Heading" />
          </SelectTrigger>
          <SelectContent className="min-w-5">
            <SelectGroup className="font-semibold">
              <SelectLabel className="py-1 pl-4">Heading</SelectLabel>
              {headingOptions.map(({ level, label, icon }) => (
                <SelectItem
                  key={level}
                  value={String(level)}
                  className={`text-zinc-500 text-${
                    level === 1 ? "xl" : level === 2 ? "lg" : "sm"
                  }`}
                >
                  <span className="flex gap-2 justify-center items-center">
                    {icon}
                    <span>{label}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

const Tiptap = ({ value, setValue }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextDirection.configure({
        types: ["heading", "paragraph", "bulletList", "orderedList"],
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: cn(
          "prose max-w-none rounded-md border border-input text-black p-2 focus:outline-none focus:ring-2 focus:ring-ring"
        ),
      },
    },
    onUpdate: ({ editor }) => {
      setValue(editor?.getHTML());
    },
  });

  return (
    <>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </>
  );
};

export default Tiptap;
