export type GalleryItem = {
  id: string;
  caption: string;
  /** Base path without extension; the build emits `-thumb.webp` and `-full.webp`. */
  base: string;
  /** Original JPEG, kept as the <img> fallback for browsers without WebP. */
  fallback: string;
  href: string;
};

export const gallery: GalleryItem[] = [
  {
    id: 'tracktion',
    caption: 'Tracktion 2025 by IEEE RAS IIT',
    base: '/assets/tracktion/main',
    fallback: '/assets/tracktion/main.jpg',
    href: 'https://www.linkedin.com/posts/pasindu-pabasara-781822307_ieee-robotics-techinnovation-activity-7322613384766504961-Mw6q',
  },
  {
    id: 'wemixt',
    caption: 'Docker 101 Session at WEMIXT',
    base: '/assets/wemixt/main',
    fallback: '/assets/wemixt/main.jpeg',
    href: 'https://www.linkedin.com/posts/wemixt_wemixt-techsparks-docker101-activity-7323330006695165953-n4I-',
  },
  {
    id: 'global-azure',
    caption: 'Global Azure 2025 by Microsoft IT Pro Community - Sri Lanka',
    base: '/assets/global_azure/main',
    fallback: '/assets/global_azure/main.jpeg',
    href: 'https://www.linkedin.com/posts/pasindu-pabasara-781822307_globalazure2025-azurebootcamp-microsoftsrilanka-activity-7327400264771014656-PxIX',
  },
  {
    id: 'finnc',
    caption: 'Finnc 2025 by RoboticGen',
    base: '/assets/finnc/main',
    fallback: '/assets/finnc/main.jpg',
    href: 'https://www.linkedin.com/posts/pasindu-pabasara-781822307_iot-roboticgen-ieee-activity-7330325513455943680--Lpr',
  },
  {
    id: 'daily-grind',
    caption: 'The Daily Grind - Season 03',
    base: '/assets/daily-grind/main',
    fallback: '/assets/daily-grind/main.jpg',
    href: 'https://www.linkedin.com/posts/pasindu-pabasara-781822307_thedailygrind-networking-learning-activity-7333517267973853187-bRqz',
  },
  {
    id: 'commit-dev',
    caption: 'Commit.dev by IEEECSIIT',
    base: '/assets/commit-dev/main',
    fallback: '/assets/commit-dev/main.jpeg',
    href: 'https://www.linkedin.com/posts/advania-sri-lanka_commitdev-advania-techinnovation-ugcPost-7335965365534896128-9Kgo',
  },
  {
    id: 'guest-talk',
    caption: 'Guest Talk 2025 by UOM IDS',
    base: '/assets/guest-talk/main',
    fallback: '/assets/guest-talk/main.jpg',
    href: 'https://www.linkedin.com/posts/pasindu-pabasara-781822307_leadership-guesttalk-rootcode-activity-7344584031373602816-pB3m',
  },
  {
    id: 'wso2',
    caption: 'Industry Visit to WSO2',
    base: '/assets/wso2/main',
    fallback: '/assets/wso2/main.jpg',
    href: 'https://www.linkedin.com/posts/pasindu-pabasara-781822307_industryvisit-wso2-itmbatch24-activity-7346802652573278208-fzDw',
  },
  {
    id: 'road-to-ignite',
    caption: 'Road to Ignite Leadership Talk Series at Rootcode',
    base: '/assets/road-to-ignite/main',
    fallback: '/assets/road-to-ignite/main.jpeg',
    href: 'https://www.linkedin.com/posts/pasindu-pabasara-781822307_leadership-rootcode-roadtoignite-activity-7348235531425640448-jzJx',
  },
  {
    id: 'moraspirit',
    caption: 'MoraSpirit first meetup (2025/26)',
    base: '/assets/moraspirit/main',
    fallback: '/assets/moraspirit/main.jpeg',
    href: 'https://www.linkedin.com/posts/pasindu-pabasara-781822307_moraspirit-webandtech-morapride-activity-7352031894277890048-n-kh',
  },
];
