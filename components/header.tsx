'use client'

import { Menu } from 'lucide-react'
import Link from 'next/link'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'

import logoImage from '@/assets/dimipabos_logo.png'
import Image from 'next/image'
import { CTAButton } from './cta'

const navigation = [
  { name: 'Início', href: '/' },
  { name: 'Sobre', href: '/sobre' },
  { name: 'Projetos', href: '/projetos' },
  { name: 'Como Ajudar', href: '/como-ajudar' },
  { name: 'Contato', href: '/contato' },
]

export function Header() {
  const [isOpen, setIsOpen] = React.useState(false)

  const pathname = usePathname()

  const closeMenu = () => setIsOpen(false)

  const isActive = (href: string) => pathname === href

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
              alt='DI MI PA BÔS'
              width={50}
              height={50}
              className='rounded-full drop-shadow-md'
            />
          </Link>
        </div>

        <div className='hidden lg:flex lg:gap-x-12'>
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'font-semibold text-base text-white leading-6 decoration-secondary underline-offset-4 transition-colors hover:underline',
                { underline: isActive(item.href) }
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
                <span className='sr-only'>Abrir menu principal</span>
                <Menu className='size-10' aria-hidden='true' />
              </SheetTrigger>
              <SheetContent side='right' className='w-full bg-slate-50 backdrop-blur-xs'>
                <div className='mt-6 flow-root'>
                  <SheetTitle className='sr-only'>The mobile menu</SheetTitle>
                  <SheetDescription className='sr-only'>
                    The navigation menu for mobile
                  </SheetDescription>

                  <div className='-my-6 divide-y'>
                    <div className='space-y-2 py-6'>
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={closeMenu}
                          className={cn(
                            '-mx-3 block rounded-md px-3 py-2 font-semibold text-base text-foreground leading-7',
                            {
                              'bg-blue-50 text-primary shadow-xs drop-shadow-xs': isActive(
                                item.href
                              ),
                            }
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
