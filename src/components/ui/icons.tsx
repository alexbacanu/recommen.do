import type { LucideIcon, LucideProps } from "lucide-react";

import {
  AlertCircle,
  ArrowDownNarrowWide,
  ArrowUpNarrowWide,
  CheckCircle,
  CheckCircle2,
  Cherry,
  CircleSlash,
  Citrus,
  Clock,
  Coffee,
  Coins,
  Edit,
  ExternalLink,
  Facebook,
  Grape,
  Key,
  LifeBuoy,
  Loader2,
  LogIn,
  LogOut,
  Minimize2,
  Percent,
  Plus,
  RefreshCw,
  Save,
  Send,
  Settings2,
  ShoppingCart,
  Sprout,
  Trash2,
  Undo2,
  User,
  X,
  XCircle,
} from "lucide-react";

export type Icon = LucideIcon;

export const Icons = {
  // logo: (props: LucideProps) => (
  //   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" {...props}>
  //     <rect width="256" height="256" fill="none" />
  //     <line
  //       x1="208"
  //       y1="128"
  //       x2="128"
  //       y2="208"
  //       fill="none"
  //       stroke="currentColor"
  //       strokeLinecap="round"
  //       strokeLinejoin="round"
  //       strokeWidth="16"
  //     />
  //     <line
  //       x1="192"
  //       y1="40"
  //       x2="40"
  //       y2="192"
  //       fill="none"
  //       stroke="currentColor"
  //       strokeLinecap="round"
  //       strokeLinejoin="round"
  //       strokeWidth="16"
  //     />
  //   </svg>
  // ),
  // add: Plus,
  // arrowRight: ArrowRight,
  // billing: CreditCard,
  // check: Check,
  // chevronLeft: ChevronLeft,
  // chevronRight: ChevronRight,
  // close: X,
  // copy: Copy,
  // copyDone: ClipboardCheck,
  // ellipsis: MoreVertical,
  // help: HelpCircle,
  // laptop: Laptop,
  // logout: LogOut,
  // media: Image,
  // moon: Moon,
  // page: File,
  // pizza: Pizza,
  // post: FileText,
  // settings: Settings,
  // sun: SunMedium,
  // trash: Trash,
  // user: User,
  // verify: CheckCircle,
  // warning: AlertTriangle,

  logo: (props: LucideProps) => (
    <svg viewBox="0 0 26.03 14.988" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g fontSize="25.4" fontFamily="antre" paintOrder="stroke markers fill">
        <path
          d="M6.623 14.988c1.499 0 2.413-.762 4.09-2.768l3.454-4.115c.381-.457.381-1.143-.076-1.524-.457-.406-1.143-.381-1.575.127l-4.318 5.13c-.737.864-1.016.94-1.27.94a.65.65 0 01-.635-.66c0-.28.076-.61.229-.965.838-1.956 2.032-4.394 3.048-6.756.228-.534.177-1.016-.28-1.321l-1.448-.89.33-.38c.382-.457.382-1.143-.076-1.524C7.64-.125 6.953-.1 6.522.409L.273 7.8A1.041 1.041 0 00.4 9.324c.457.407 1.143.33 1.524-.127l4.547-5.385.736.432c-.787 1.88-1.778 3.937-2.692 6.02-.254.584-.508 1.32-.508 2.083 0 .711.229 1.346.66 1.829.483.508 1.194.812 1.956.812z"
          fill="#6366f1"
        />
        <path
          d="M25.7 9.752c-.457-.407-1.118-.407-1.55.101-1.777 2.083-3.555 2.921-5.562 2.921-1.245 0-2.26-.279-2.743-.914-.381-.508-.559-1.245-.407-2.057h2.337c3.505 0 6.147-1.702 6.147-4.801 0-2.362-1.905-3.505-3.81-3.505-1.016 0-2.007.152-2.92.635-.966.482-1.931 1.32-3.024 2.616l-3.53 4.191c-.407.457-.407 1.168.05 1.575.204.178.458.254.712.254.305 0 .61-.102.838-.356l1.143-1.371c-.406 1.549-.102 3.048.711 4.14.66.889 1.88 1.803 4.293 1.803 2.946 0 5.36-1.244 7.366-3.708.355-.432.406-1.118-.05-1.524zm-3.988-4.166c-.38 1.804-2.464 2.032-3.937 2.032h-1.727c.025-.152.076-.33.127-.508.584-2.032 1.88-3.429 3.835-3.429 1.194 0 1.956.788 1.702 1.905z"
          fill="#c026d3"
        />
      </g>
    </svg>
  ),

  spinner: Loader2,
  account: User,
  edit: Edit,
  login: LogIn,
  logout: LogOut,
  verify: CheckCircle,
  trash: Trash2,
  remove: X,
  undo: Undo2,

  cancel: CircleSlash,
  success: CheckCircle2,
  fail: XCircle,

  support: LifeBuoy,
  clock: Clock,
  minimize: Minimize2,
  refresh: RefreshCw,
  coins: Coins,
  sprout: Sprout,
  coffee: Coffee,
  key: Key,
  alert: AlertCircle,
  save: Save,
  send: Send,
  link: ExternalLink,
  cart: ShoppingCart,

  collapseDown: ArrowDownNarrowWide,
  collapseUp: ArrowUpNarrowWide,

  plan1: Cherry,
  plan2: Grape,
  plan3: Citrus,
  manage: Settings2,
  percent: Percent,
  subscribe: Plus,

  google: (props: LucideProps) => (
    <svg role="img" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
      />
    </svg>
  ),
  github: (props: LucideProps) => (
    <svg viewBox="0 0 438.549 438.549" {...props}>
      <path
        fill="currentColor"
        d="M409.132 114.573c-19.608-33.596-46.205-60.194-79.798-79.8-33.598-19.607-70.277-29.408-110.063-29.408-39.781 0-76.472 9.804-110.063 29.408-33.596 19.605-60.192 46.204-79.8 79.8C9.803 148.168 0 184.854 0 224.63c0 47.78 13.94 90.745 41.827 128.906 27.884 38.164 63.906 64.572 108.063 79.227 5.14.954 8.945.283 11.419-1.996 2.475-2.282 3.711-5.14 3.711-8.562 0-.571-.049-5.708-.144-15.417a2549.81 2549.81 0 01-.144-25.406l-6.567 1.136c-4.187.767-9.469 1.092-15.846 1-6.374-.089-12.991-.757-19.842-1.999-6.854-1.231-13.229-4.086-19.13-8.559-5.898-4.473-10.085-10.328-12.56-17.556l-2.855-6.57c-1.903-4.374-4.899-9.233-8.992-14.559-4.093-5.331-8.232-8.945-12.419-10.848l-1.999-1.431c-1.332-.951-2.568-2.098-3.711-3.429-1.142-1.331-1.997-2.663-2.568-3.997-.572-1.335-.098-2.43 1.427-3.289 1.525-.859 4.281-1.276 8.28-1.276l5.708.853c3.807.763 8.516 3.042 14.133 6.851 5.614 3.806 10.229 8.754 13.846 14.842 4.38 7.806 9.657 13.754 15.846 17.847 6.184 4.093 12.419 6.136 18.699 6.136 6.28 0 11.704-.476 16.274-1.423 4.565-.952 8.848-2.383 12.847-4.285 1.713-12.758 6.377-22.559 13.988-29.41-10.848-1.14-20.601-2.857-29.264-5.14-8.658-2.286-17.605-5.996-26.835-11.14-9.235-5.137-16.896-11.516-22.985-19.126-6.09-7.614-11.088-17.61-14.987-29.979-3.901-12.374-5.852-26.648-5.852-42.826 0-23.035 7.52-42.637 22.557-58.817-7.044-17.318-6.379-36.732 1.997-58.24 5.52-1.715 13.706-.428 24.554 3.853 10.85 4.283 18.794 7.952 23.84 10.994 5.046 3.041 9.089 5.618 12.135 7.708 17.705-4.947 35.976-7.421 54.818-7.421s37.117 2.474 54.823 7.421l10.849-6.849c7.419-4.57 16.18-8.758 26.262-12.565 10.088-3.805 17.802-4.853 23.134-3.138 8.562 21.509 9.325 40.922 2.279 58.24 15.036 16.18 22.559 35.787 22.559 58.817 0 16.178-1.958 30.497-5.853 42.966-3.9 12.471-8.941 22.457-15.125 29.979-6.191 7.521-13.901 13.85-23.131 18.986-9.232 5.14-18.182 8.85-26.84 11.136-8.662 2.286-18.415 4.004-29.263 5.146 9.894 8.562 14.842 22.077 14.842 40.539v60.237c0 3.422 1.19 6.279 3.572 8.562 2.379 2.279 6.136 2.95 11.276 1.995 44.163-14.653 80.185-41.062 108.068-79.226 27.88-38.161 41.825-81.126 41.825-128.906-.01-39.771-9.818-76.454-29.414-110.049z"
      ></path>
    </svg>
  ),
  facebook: Facebook,
};
