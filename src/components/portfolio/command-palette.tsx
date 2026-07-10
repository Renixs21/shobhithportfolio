"use client";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  ArrowUp,
  Github,
  Linkedin,
  Mail,
  Phone,
  Send,
  type LucideIcon,
} from "lucide-react";
import { NAV_LINKS, PROFILE } from "@/lib/portfolio-data";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Action {
  id: string;
  label: string;
  hint: string;
  icon: LucideIcon;
  run: () => void;
  group: string;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const scrollTo = (id: string) => {
    onOpenChange(false);
    setTimeout(
      () => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }),
      60
    );
  };

  const navActions: Action[] = NAV_LINKS.map((l) => ({
    id: l.id,
    label: l.label,
    hint: l.hint,
    icon: ArrowUp,
    run: () => scrollTo(l.id),
    group: "Navigate",
  }));

  const contactActions: Action[] = [
    {
      id: "email",
      label: "Email Shobhith",
      hint: PROFILE.email,
      icon: Mail,
      run: () => {
        onOpenChange(false);
        window.location.href = `mailto:${PROFILE.email}`;
      },
      group: "Connect",
    },
    {
      id: "phone",
      label: "Call Shobhith",
      hint: PROFILE.phone,
      icon: Phone,
      run: () => {
        onOpenChange(false);
        window.location.href = `tel:${PROFILE.phone.replace(/\s/g, "")}`;
      },
      group: "Connect",
    },
    {
      id: "github",
      label: "Open GitHub",
      hint: PROFILE.githubHandle,
      icon: Github,
      run: () => {
        onOpenChange(false);
        window.open(PROFILE.github, "_blank");
      },
      group: "Connect",
    },
    {
      id: "linkedin",
      label: "Open LinkedIn",
      hint: PROFILE.linkedinHandle,
      icon: Linkedin,
      run: () => {
        onOpenChange(false);
        window.open(PROFILE.linkedin, "_blank");
      },
      group: "Connect",
    },
    {
      id: "transmit",
      label: "Send a message",
      hint: "open contact form",
      icon: Send,
      run: () => scrollTo("transmit"),
      group: "Connect",
    },
  ];

  const topAction: Action = {
    id: "top",
    label: "Back to top",
    hint: "overture",
    icon: ArrowUp,
    run: () => {
      onOpenChange(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    group: "Navigate",
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Type a command or search…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigate">
          <CommandItem
            value={`${topAction.label} ${topAction.hint}`}
            onSelect={topAction.run}
          >
            <topAction.icon className="mr-2 h-4 w-4" />
            <span>{topAction.label}</span>
          </CommandItem>
          {navActions.map((a) => (
            <CommandItem
              key={a.id}
              value={`${a.label} ${a.hint}`}
              onSelect={a.run}
            >
              <a.icon className="mr-2 h-4 w-4" />
              <span>{a.label}</span>
              <span className="ml-auto text-muted-foreground text-xs">
                {a.hint}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Connect">
          {contactActions.map((a) => (
            <CommandItem
              key={a.id}
              value={`${a.label} ${a.hint}`}
              onSelect={a.run}
            >
              <a.icon className="mr-2 h-4 w-4" />
              <span>{a.label}</span>
              <span className="ml-auto text-muted-foreground text-xs">
                {a.hint}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
