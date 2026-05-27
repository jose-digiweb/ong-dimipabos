'use client'

import { Menu } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

import logoImage from '@/assets/dimipabos_logo.png'
import { Button } from '@/components/ui/button'
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
 * The {@link navigationItems} constant
 * @description Primary navigation entries rendered in both desktop and mobile menus
 */
const navigationItems = [
  { name: 'Início', href: '/' },
  { name: 'Sobre', href: '/sobre' },
  { name: 'Projetos', href: '/projetos' },
  { name: 'Como Ajudar', href: '/como-ajudar' },
  { name: 'Contato', href: '/contato' },
] as const

/**
 * The {@link headerCopy} constant
 * @description Static copy used by the {@link Header} component
 */
const headerCopy = {
  LOGO_ALT: 'DI MI PA BÔS',
  MENU_TOGGLE_LABEL: 'Abrir menu principal',
  MOBILE_MENU_TITLE: 'The mobile menu',
  MOBILE_MENU_DESCRIPTION: 'The navigation menu for mobile',
} as const

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

  // Read the current path so we can highlight the active nav entry
  const pathname = usePathname()

  // Closes the mobile menu, used by nav link click handlers
  const closeMenu = () => setIsOpen(false)

  // Returns true when the given href matches the current route
  const isActive = (href: string) => pathname === href

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
              alt={headerCopy.LOGO_ALT}
              width={LOGO_SIZE}
              height={LOGO_SIZE}
              className='rounded-full drop-shadow-md'
            />
          </Link>
        </div>

        <div className='hidden lg:flex lg:gap-x-12'>
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'font-semibold text-base text-white leading-6 decoration-secondary underline-offset-4 transition-colors hover:underline',
                { underline: isActive(item.href) },
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className='flex items-center gap-4'>
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
                <span className='sr-only'>{headerCopy.MENU_TOGGLE_LABEL}</span>
                <Menu className='size-10' aria-hidden='true' />
              </SheetTrigger>
              <SheetContent side='right' className='w-full bg-slate-50 px-6 py-6 backdrop-blur-xs'>
                <div className='mt-6 flow-root'>
                  <SheetTitle className='sr-only'>{headerCopy.MOBILE_MENU_TITLE}</SheetTitle>
                  <SheetDescription className='sr-only'>
                    {headerCopy.MOBILE_MENU_DESCRIPTION}
                  </SheetDescription>

                  <div className='divide-y'>
                    <div className='space-y-2 pb-6'>
                      {navigationItems.map((item) => (
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
                      ))}
                    </div>
                    <div className='py-6'>
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
