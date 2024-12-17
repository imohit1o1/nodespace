import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { noteSchema } from "@/schema/noteSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { useState } from "react";

type noteFormValues = z.infer<typeof noteSchema>;

interface CreateNoteDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NoteForm({ isOpen, onClose }: CreateNoteDialogProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<noteFormValues>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      title: "",
      content: "",
      isPinned: false,
      isFavorite: false,
      backgroundColor: "bg-muted/30",
      textColor: "text-foreground",
    },
  });

  const handleSubmit = async (data: noteFormValues) => {
    try {
      setLoading(true);
      await axios.post("/api/notes", data);
      toast({ title: "Note created successfully!" });
      onClose();
    } catch (error) {
      console.error("Error creating note:", error);
      toast({ title: "Error creating note" });
    } finally {
      setLoading(false);
      onClose();
      form.reset();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-w-[300px] md:max-w-xl">
        <DialogHeader className="text-left">
          <DialogTitle>Create Note</DialogTitle>
          <DialogDescription className="text-xs">
            Create a new note here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col gap-4"
          >
            {/* Title field */}
            <FormField
              name="title"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <label htmlFor="title" className="text-sm font-medium">
                    Title
                  </label>
                  <FormControl>
                    <Input placeholder="Enter your Title here" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Content field */}
            <FormField
              name="content"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <label htmlFor="content" className="text-sm font-medium">
                    Content
                  </label>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="md:h-[300px] h-[200px]"
                      placeholder="Write your content here..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <section className="flex flex-col justify-between md:flex-row gap-x-6">
              {/* Background Color field */}
              <FormField
                name="backgroundColor"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="w-[140px]">
                    <label
                      htmlFor="backgroundColor"
                      className="text-sm font-medium"
                    >
                      Background Color
                    </label>
                    <FormControl>
                      <Select
                        onValueChange={(value) => field.onChange(value)}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Default" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="bg-muted/30">Default</SelectItem>
                            <SelectItem value="bg-red-300">Red</SelectItem>
                            <SelectItem value="bg-green-300">Green</SelectItem>
                            <SelectItem value="bg-blue-300">Blue</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="textColor"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="w-[140px]">
                    <label htmlFor="textColor" className="text-sm font-medium">
                      Text Color
                    </label>
                    <FormControl>
                      <Select
                        onValueChange={(value) => field.onChange(value)}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Default" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="text-foreground">
                              Default
                            </SelectItem>
                            <SelectItem value="text-red-200">Red</SelectItem>
                            <SelectItem value="text-green-200">
                              Green
                            </SelectItem>
                            <SelectItem value="text-blue-200">Blue</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Pinned field */}
              <FormField
                name="isPinned"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="  border-red-600">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    </FormControl>
                    <label
                      htmlFor="isPinned"
                      className="text-sm font-medium ml-2"
                    >
                      Pinned
                    </label>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Favorite field */}
              <FormField
                name="isFavorite"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    </FormControl>
                    <label
                      htmlFor="isFavorite"
                      className="text-sm font-medium ml-2"
                    >
                      Favourite
                    </label>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </section>
            <DialogFooter>
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? "Saving..." : "Save Note"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
