'use client'

import { Menu } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useState } from 'react'

import logoImage from '@/assets/dimipabos_logo.png'
import { LanguageSwitcher } from '@/components/language-switcher'
import { Button } from '@/components/ui/button'
import { Link, usePathname } from '@/i18n/navigation'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

import { CTAButton } from './cta'

/**
 * The {@link navItemKind} constant
 * @description Discriminator values for primary navigation entries
 */
const navItemKind = {
  LINK: 'link',
  MENU: 'menu',
} as const

/**
 * The {@link NavLinkItem} type
 * @description A top-level navigation entry that links directly to a route
 */
type NavLinkItem = {
  kind: typeof navItemKind.LINK
  name: string
  href: string
}

/**
 * The {@link NavChildItem} type
 * @description A child link rendered inside a navigation dropdown
 */
type NavChildItem = {
  name: string
  href: string
  description?: string
}

/**
 * The {@link NavMenuItem} type
 * @description A top-level navigation entry that opens a dropdown of child links
 */
type NavMenuItem = {
  kind: typeof navItemKind.MENU
  name: string
  items: readonly NavChildItem[]
}

/**
 * The {@link NavItem} type
 * @description Discriminated union of supported primary navigation entries
 */
type NavItem = NavLinkItem | NavMenuItem

/**
 * The {@link LOGO_SIZE} constant
 * @description Logo pixel dimensions
 */
const LOGO_SIZE = 50

/**
 * The {@link Header} component
 * @description Global site header with responsive navigation and a primary CTA
 * @returns The rendered header
 */
export function Header() {
  // Track the open/closed state of the mobile menu sheet
  const [isOpen, setIsOpen] = useState(false)

  // Read translations for the header chrome and primary nav
  const tNav = useTranslations('nav')
  const tHeader = useTranslations('header')

  // Build the navigation tree from the active locale's translations
  const navigationItems: readonly NavItem[] = [
    { kind: navItemKind.LINK, name: tNav('home'), href: '/' },
    { kind: navItemKind.LINK, name: tNav('about'), href: '/sobre' },
    { kind: navItemKind.LINK, name: tNav('projects'), href: '/projetos' },
    {
      kind: navItemKind.MENU,
      name: tNav('help'),
      items: [
        {
          name: tNav('donate.label'),
          href: '/como-ajudar/doar',
          description: tNav('donate.description'),
        },
        {
          name: tNav('volunteer.label'),
          href: '/como-ajudar/voluntario',
          description: tNav('volunteer.description'),
        },
        {
          name: tNav('partner.label'),
          href: '/como-ajudar/parceiros',
          description: tNav('partner.description'),
        },
      ],
    },
    { kind: navItemKind.LINK, name: tNav('contact'), href: '/contato' },
  ]

  // Read the current path so we can highlight the active nav entry
  const pathname = usePathname()

  // Closes the mobile menu, used by nav link click handlers
  const closeMenu = () => setIsOpen(false)

  // Returns true when the given href matches the current route
  const isActive = (href: string) => pathname === href

  // Returns true when any of the menu's child routes matches the current path
  const isMenuActive = (items: readonly NavChildItem[]) =>
    items.some((item) => pathname === item.href)

  // Render the sticky header with logo, desktop nav, CTA and mobile sheet
  return (
    <header className='sticky top-0 z-50 w-full bg-primary drop-shadow-md'>
      <nav
        className='mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8'
        aria-label='Global'
      >
        <div className='flex rounded-full drop-shadow-md'>
          <Link href='/' className='rounded-full font-bold text-white text-xl drop-shadow-md'>
            <Image
              src={logoImage}
              alt={tHeader('logoAlt')}
              width={LOGO_SIZE}
              height={LOGO_SIZE}
              className='rounded-full drop-shadow-md'
            />
          </Link>
        </div>

        <NavigationMenu className='hidden lg:flex' align='center'>
          <NavigationMenuList className='gap-x-8'>
            {navigationItems.map((item) => {
              // Render a link-kind entry as a plain Next.js link
              if (item.kind === navItemKind.LINK) {
                return (
                  <NavigationMenuItem key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        'font-semibold text-base text-white leading-6 decoration-secondary underline-offset-4 transition-colors hover:underline',
                        { underline: isActive(item.href) },
                      )}
                    >
                      {item.name}
                    </Link>
                  </NavigationMenuItem>
                )
              }

              // Render a menu-kind entry as a trigger + dropdown of child links
              return (
                <NavigationMenuItem key={item.name}>
                  <NavigationMenuTrigger
                    className={cn(
                      'h-auto bg-transparent px-0 py-0 font-semibold text-base text-white leading-6 hover:bg-transparent hover:underline focus:bg-transparent focus-visible:ring-0 data-open:bg-transparent data-open:hover:bg-transparent data-open:focus:bg-transparent data-popup-open:bg-transparent data-popup-open:hover:bg-transparent',
                      'decoration-secondary underline-offset-4',
                      { underline: isMenuActive(item.items) },
                    )}
                  >
                    {item.name}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className='grid w-75 gap-1 p-2'>
                      {item.items.map((child) => (
                        <li key={child.href}>
                          <NavigationMenuLink
                            active={isActive(child.href)}
                            render={
                              <Link href={child.href} className='flex flex-col items-start gap-1' />
                            }
                          >
                            <span className='font-medium text-foreground text-sm'>
                              {child.name}
                            </span>
                            {child.description && (
                              <span className='text-muted-foreground text-xs leading-snug'>
                                {child.description}
                              </span>
                            )}
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              )
            })}
          </NavigationMenuList>
        </NavigationMenu>

        <div className='flex items-center gap-4'>
          <div className='hidden lg:flex'>
            <LanguageSwitcher />
          </div>
          <div className='flex'>
            <CTAButton size='default' />
          </div>

          <div className='flex lg:hidden'>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger
                render={
                  <Button
                    size='none'
                    variant='clean'
                    className='inline-flex items-center justify-center rounded-md text-white'
                  />
                }
              >
                <span className='sr-only'>{tHeader('menuToggle')}</span>
                <Menu className='size-10' aria-hidden='true' />
              </SheetTrigger>
              <SheetContent side='right' className='w-full bg-slate-50 px-6 py-6 backdrop-blur-xs'>
                <div className='mt-6 flow-root'>
                  <SheetTitle className='sr-only'>{tHeader('mobileMenuTitle')}</SheetTitle>
                  <SheetDescription className='sr-only'>
                    {tHeader('mobileMenuDescription')}
                  </SheetDescription>

                  <div className='divide-y'>
                    <div className='space-y-2 pb-6'>
                      {navigationItems.map((item) => {
                        // Render a link entry on mobile
                        if (item.kind === navItemKind.LINK) {
                          return (
                            <Link
                              key={item.name}
                              href={item.href}
                              onClick={closeMenu}
                              className={cn(
                                '-mx-3 block rounded-md px-3 py-2 font-semibold text-base text-foreground leading-7',
                                {
                                  'bg-blue-50 text-primary shadow-xs drop-shadow-xs': isActive(
                                    item.href,
                                  ),
                                },
                              )}
                            >
                              {item.name}
                            </Link>
                          )
                        }

                        // Render a menu entry on mobile as a section header + indented children
                        return (
                          <div key={item.name} className='space-y-1'>
                            <p
                              className={cn(
                                '-mx-3 px-3 py-2 font-semibold text-base text-muted-foreground leading-7',
                                { 'text-primary': isMenuActive(item.items) },
                              )}
                            >
                              {item.name}
                            </p>
                            {item.items.map((child) => (
                              <Link
                                key={child.href}
                                href={child.href}
                                onClick={closeMenu}
                                className={cn(
                                  '-mx-3 block rounded-md px-6 py-2 font-medium text-base text-foreground leading-7',
                                  {
                                    'bg-blue-50 text-primary shadow-xs drop-shadow-xs': isActive(
                                      child.href,
                                    ),
                                  },
                                )}
                              >
                                {child.name}
                              </Link>
                            ))}
                          </div>
                        )
                      })}
                    </div>
                    <div className='py-6 space-y-4'>
                      <LanguageSwitcher />
                      <CTAButton className='w-full' onClick={closeMenu} />
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  )
}
