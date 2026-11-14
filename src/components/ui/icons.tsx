import { Icon, type IconifyIcon } from "@iconify/react"

function createIcon(icon: IconifyIcon) {
  return function SiteIcon({ size = 24 }: { size?: number }) {
    return <Icon icon={icon} width={size} height={size} aria-hidden="true" focusable="false" />
  }
}

// keyline-icons:arrow-down
export const ArrowDown = createIcon({
  width: 24,
  height: 24,
  body: "<path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M5 12.1229L11.5875 18.8261C11.8153 19.058 12.1847 19.058 12.4125 18.8261L19 12.1229M12 5V18.0587\"/>",
})

// keyline-icons:arrow-right
export const ArrowRight = createIcon({
  width: 24,
  height: 24,
  body: "<path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M5 12H18.0587M12.1229 5L18.8261 11.5875C19.058 11.8153 19.058 12.1847 18.8261 12.4125L12.1229 19\"/>",
})

// keyline-icons:arrow-up-right
export const ArrowUpRight = createIcon({
  width: 24,
  height: 24,
  body: "<path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M6 6H17.5C17.77614 6 18 6.22386 18 6.5V18M7.2 16.8L17.4 6.6\"/>",
})

// keyline-icons:book-open
export const BookOpen = createIcon({
  width: 24,
  height: 24,
  body: "<path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M4 4L8 4C10.2091 4 12 5.7909 12 8C12 5.7909 13.7909 4 16 4L20 4C21.1046 4 22 4.8954 22 6L22 15C22 16.1046 21.1046 17 20 17L15 17C13.3431 17 12 18.3431 12 20C12 18.3431 10.6569 17 9 17L4 17C2.8954 17 2 16.1046 2 15L2 6C2 4.8954 2.8954 4 4 4ZM12 8L12 20\"/>",
})

// keyline-icons:chart-no-axes-combined
export const ChartNoAxesCombined = createIcon({
  width: 24,
  height: 24,
  body: "<path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M22 3L13.5984 10.0013C13.2465 10.2945 12.7405 10.3112 12.37 10.0418L8.1911 7.0026C7.7931 6.7132 7.2437 6.7563 6.8958 7.1042L2 12M4 21L4 17M8 21L8 12M12 21L12 15M16 21L16 13.5M20 21L20 10\"/>",
})

// keyline-icons:circle-check
export const CheckCircle2 = createIcon({
  width: 24,
  height: 24,
  body: "<g fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\"><path d=\"M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2Z\"/><path d=\"M8 12L10.6667 15L16 9\"/></g>",
})

// keyline-icons:chevron-down
export const ChevronDown = createIcon({
  width: 24,
  height: 24,
  body: "<path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M6 9L12 15L18 9\"/>",
})

// keyline-icons:chevron-right
export const ChevronRight = createIcon({
  width: 24,
  height: 24,
  body: "<path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 6L15 12L9 18\"/>",
})

// keyline-icons:file-text
export const FileText = createIcon({
  width: 24,
  height: 24,
  body: "<path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M14 2H8C5.79086 2 4 3.79086 4 6V18C4 20.2091 5.79086 22 8 22H16C18.2091 22 20 20.2091 20 18V8L14 2ZM14 2V5C14 6.65685 15.3431 8 17 8H20M8 13H12M8 17H16\"/>",
})

// keyline-icons:flame
export const Flame = createIcon({
  width: 24,
  height: 24,
  body: "<path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M16 2C16 4.1637 16.7018 6.269 18 8C19.2982 9.731 20 11.8363 20 14C20 18.4183 16.4183 22 12 22C7.5817 22 4 18.4183 4 14C4 12.8318 4.2558 11.6778 4.7495 10.6191C4.9138 10.2668 5.2672 10.0417 5.6558 10.0417C6.2081 10.0417 6.6558 10.4894 6.6558 11.0417C6.6558 11.2172 6.6096 11.3897 6.5219 11.5417C6.3463 11.8457 6.2539 12.1906 6.2539 12.5417C6.2539 13.6462 7.1494 14.5417 8.2539 14.5417C9.3585 14.5417 10.2539 13.6462 10.2539 12.5417C10.2539 8.2798 12.4181 4.3095 16 2Z\"/>",
})

// keyline-icons:flask-conical
export const FlaskConical = createIcon({
  width: 24,
  height: 24,
  body: "<path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M10.5 2L13.5 2C14.0523 2 14.5 2.4477 14.5 3L14.5 7.7741C14.5 7.9228 14.5332 8.0697 14.5971 8.204L19.8035 19.1403C20.4353 20.4675 19.4675 22 17.9976 22L6.0024 22C4.5325 22 3.5647 20.4675 4.1965 19.1403L9.4029 8.204C9.4668 8.0697 9.5 7.9228 9.5 7.7741L9.5 3C9.5 2.4477 9.9477 2 10.5 2ZM8 2L16 2M4.7394 18L19.2606 18\"/>",
})

// keyline-icons:folder
export const Folder = createIcon({
  width: 24,
  height: 24,
  body: "<path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M3 7C3 5.3431 4.3431 4 6 4L8.6716 4C9.202 4 9.7107 4.2107 10.0858 4.5858L11.4142 5.9142C11.7893 6.2893 12.298 6.5 12.8284 6.5L18 6.5C19.6569 6.5 21 7.8431 21 9.5L21 17C21 18.6569 19.6569 20 18 20L6 20C4.3431 20 3 18.6569 3 17Z\"/>",
})

// keyline-icons:layers
export const Layers3 = createIcon({
  width: 24,
  height: 24,
  body: "<path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M12.4382 2.1011L21.4382 6.4886C22.1873 6.8538 22.1873 7.9212 21.4382 8.2864L12.4382 12.6739C12.1616 12.8087 11.8384 12.8087 11.5618 12.6739L2.5618 8.2864C1.8127 7.9212 1.8127 6.8538 2.5618 6.4886L11.5618 2.1011C11.8384 1.9663 12.1616 1.9663 12.4382 2.1011ZM2 12.625L11.5618 17.2864C11.8384 17.4212 12.1616 17.4212 12.4382 17.2864L22 12.625M2 17.2375L11.5618 21.8989C11.8384 22.0337 12.1616 22.0337 12.4382 21.8989L22 17.2375\"/>",
})

// keyline-icons:menu
export const Menu = createIcon({
  width: 24,
  height: 24,
  body: "<path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M4 6H20M4 12H20M4 18H20\"/>",
})

// keyline-icons:chart-network
export const Network = createIcon({
  width: 24,
  height: 24,
  body: "<path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M3 3L3 19C3 20.1046 3.8954 21 5 21L21 21M11 7C11 8.1046 10.1046 9 9 9C7.8954 9 7 8.1046 7 7C7 5.8954 7.8954 5 9 5C10.1046 5 11 5.8954 11 7ZM13 15C13 16.1046 12.1046 17 11 17C9.8954 17 9 16.1046 9 15C9 13.8954 9.8954 13 11 13C12.1046 13 13 13.8954 13 15ZM21 13C21 14.1046 20.1046 15 19 15C17.8954 15 17 14.1046 17 13C17 11.8954 17.8954 11 19 11C20.1046 11 21 11.8954 21 13ZM9.4851 8.9403L10.5149 13.0597M12.9403 14.5149L17.0597 13.4851\"/>",
})

// keyline-icons:arrow-u-turn-left-sharp-two-tone
export const Reset = createIcon({
  width: 24,
  height: 24,
  body: "<path fill=\"none\" stroke=\"currentColor\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M11 19L14 19C16.7614 19 19 16.7614 19 14C19 11.2386 16.7614 9 14 9L5.3753 9M10.2739 4.7809L5 9L10.3753 13.3002\"/>",
})

// keyline-icons:search
export const Search = createIcon({
  width: 24,
  height: 24,
  body: "<path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10ZM15 15L21 21\"/>",
})

// keyline-icons:shield-check
export const ShieldCheck = createIcon({
  width: 24,
  height: 24,
  body: "<path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M5.18251 5.16845C7.83034 4.85425 9.82952 3.53222 11.0242 2.37315C11.537 1.87562 12.463 1.87562 12.9758 2.37315C14.1705 3.53222 16.1697 4.85425 18.8175 5.16845C19.4672 5.24554 20 5.75056 20 6.38285V12.5708C20 14.3452 19.7111 16.1513 18.612 17.5729C17.4097 19.1277 15.5033 20.8703 12.8298 21.8525C12.2945 22.0492 11.7055 22.0492 11.1702 21.8525C8.49668 20.8703 6.59026 19.1277 5.38804 17.5729C4.28885 16.1513 4 14.3452 4 12.5708V6.38285C4 5.75056 4.53284 5.24554 5.18251 5.16845ZM8 12L10.6667 15L16 9\"/>",
})

// keyline-icons:sliders-horizontal
export const SlidersHorizontal = createIcon({
  width: 24,
  height: 24,
  body: "<path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M3 5L12 5M21 5L16 5M16 3L16 7M3 12L10 12M21 12L14 12M10 10L10 14M3 19L10 19M21 19L14 19M14 17L14 21\"/>",
})

// keyline-icons:sparkles
export const Sparkles = createIcon({
  width: 24,
  height: 24,
  body: "<path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M15.4651 9.1794L16.7409 12.4141C16.8933 12.8006 17.1994 13.1067 17.5859 13.2591L20.8206 14.5349C21.0117 14.6102 21.1372 14.7947 21.1372 15C21.1372 15.2053 21.0117 15.3898 20.8206 15.4651L17.5859 16.7409C17.1994 16.8933 16.8933 17.1994 16.7409 17.5859L15.4651 20.8206C15.3898 21.0117 15.2053 21.1372 15 21.1372C14.7947 21.1372 14.6102 21.0117 14.5349 20.8206L13.2591 17.5859C13.1067 17.1994 12.8006 16.8933 12.4141 16.7409L9.1794 15.4651C8.9883 15.3898 8.8628 15.2053 8.8628 15C8.8628 14.7947 8.9883 14.6102 9.1794 14.5349L12.4141 13.2591C12.8006 13.1067 13.1067 12.8006 13.2591 12.4141L14.5349 9.1794C14.6102 8.9883 14.7947 8.8628 15 8.8628C15.2053 8.8628 15.3898 8.9883 15.4651 9.1794ZM6.7151 3.1794L7.2131 4.4419C7.3655 4.8285 7.6715 5.1345 8.0581 5.2869L9.3206 5.7849C9.5117 5.8602 9.6372 6.0447 9.6372 6.25C9.6372 6.4553 9.5117 6.6398 9.3206 6.7151L8.0581 7.2131C7.6715 7.3655 7.3655 7.6715 7.2131 8.0581L6.7151 9.3206C6.6398 9.5117 6.4553 9.6372 6.25 9.6372C6.0447 9.6372 5.8602 9.5117 5.7849 9.3206L5.2869 8.0581C5.1345 7.6715 4.8285 7.3655 4.4419 7.2131L3.1794 6.7151C2.9883 6.6398 2.8628 6.4553 2.8628 6.25C2.8628 6.0447 2.9883 5.8602 3.1794 5.7849L4.4419 5.2869C4.8285 5.1345 5.1345 4.8285 5.2869 4.4419L5.7849 3.1794C5.8602 2.9883 6.0447 2.8628 6.25 2.8628C6.4553 2.8628 6.6398 2.9883 6.7151 3.1794Z\"/>",
})

// keyline-icons:x
export const X = createIcon({
  width: 24,
  height: 24,
  body: "<path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M7 7L17 17M17 7L7 17\"/>",
})

// bi:arrow-up-square-fill
export const Send = createIcon({
  width: 16,
  height: 16,
  body: "<path fill=\"currentColor\" d=\"M2 16a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2zm6.5-4.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 1 0\"/>",
})
