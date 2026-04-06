"use client";

const images = [
  {
    name: 'Cavallery',
    url: 'https://cavallery.id',
    logo: 'https://cavallery.id/wp-content/uploads/2025/05/cropped-cropped-LOGO-CAVA-150x150.png',
  },
  {
    name: 'FritzyForce',
    url: 'https://fritzyforce.com',
    logo: 'https://files.catbox.moe/i0qrcx.png',
  },
  {
    name: 'JKT48Connect APP',
    url: 'https://github.com/jkt48connect/jkt48connect-app',
    logo: 'https://files.catbox.moe/7x3l1y.png',
  },
  {
    name: 'Nayrakuen',
    url: 'https://nayrakuen.com',
    logo: 'https://files.catbox.moe/kmsod4.png',
  },
  {
    name: 'GISTREAM',
    url: 'https://gstreamlive.com',
    logo: 'https://files.catbox.moe/usad8o.png',
  },
  {
    name: 'Maxineiu',
    url: '#',
    logo: 'https://files.catbox.moe/xrxnfj.png',
  },
];

function LogoItem({ name, url, logo }: { name: string; url: string; logo: string }) {
  return (
    <a
      href={url}
      target={url !== '#' ? '_blank' : undefined}
      rel="noopener noreferrer"
      className="flex items-center gap-2 px-5 shrink-0 text-foreground/60 dark:text-foreground/40 hover:text-foreground/80 dark:hover:text-foreground/60 transition-colors"
    >
      <img
        src={logo}
        alt={name}
        width={20}
        height={20}
        className="shrink-0 rounded-sm object-contain opacity-60 dark:opacity-40 hover:opacity-80 transition-opacity"
        style={{ width: 20, height: 20 }}
      />
      <span className="text-xs font-medium whitespace-nowrap tracking-wide">
        {name}
      </span>
    </a>
  );
}

export function TrustedBy() {
  return (
    <div className="space-y-3">
      <div className="relative overflow-hidden">
        {/* Fade masks on left and right */}
        <div
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            maskImage:
              "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
          }}
        >
          <div className="flex animate-logo-marquee w-fit">
            {/* Repeat 2 times for seamless loop */}
            {[0, 1].map((setIdx) => (
              <div key={setIdx} className="flex shrink-0">
                {images.map((item, i) => (
                  <LogoItem
                    key={`${setIdx}-${i}-${item.name}`}
                    name={item.name}
                    url={item.url}
                    logo={item.logo}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
        {/* Invisible spacer to maintain height */}
        <div className="flex invisible" aria-hidden="true">
          <LogoItem
            name={images[0].name}
            url={images[0].url}
            logo={images[0].logo}
          />
        </div>
      </div>
    </div>
  );
}
