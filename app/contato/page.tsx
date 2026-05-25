import { ContactForm } from '@/components/contact-form'
import { CTASection } from '@/components/cta'
import {
  HeroCardSection,
  HeroDescription,
  HeroTitle,
  HeroTopText,
  HeroWrapper,
} from '@/components/heroSection'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { SectionDescription, SectionTitle } from '@/components/ui/section'
import { ArrowRight, Facebook, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import Link from 'next/link'

export default function ContactPage() {
  return (
    <div className='flex min-h-screen flex-col'>
      {/* Hero Section */}
      <HeroWrapper>
        <div className='flex flex-col justify-center'>
          <HeroTopText>Fale Conosco</HeroTopText>

          <HeroTitle>
            Entre em Contato{' '}
            <span className='relative whitespace-nowrap'>
              <span className='relative text-primary'>Conosco</span>
            </span>
          </HeroTitle>

          <HeroDescription>
            Estamos aqui para ajudar. Nossa equipe está pronta para responder suas dúvidas e ouvir
            suas sugestões.
          </HeroDescription>

          <div className='mt-8 flex flex-col gap-4 sm:flex-row'>
            <Button
              render={<Link href='/contato#enviar-mensagem' />}
              nativeButton={false}
              size='lg'
              variant='CTA'
            >
              Enviar Mensagem
              <ArrowRight className='ml-2 size-4' />
            </Button>

            <Button
              render={
                <a
                  target='_blank'
                  rel='noopener noreferrer'
                  href='https://wa.me/31631791165'
                  className='hover:text-secondary'
                />
              }
              nativeButton={false}
              size='lg'
              variant='outline'
            >
              WhatsApp
            </Button>
          </div>
        </div>

        <HeroCardSection>
          <div className='relative rounded-2xl bg-white p-8 shadow-2xl'>
            <div className='grid gap-6'>
              <div className='flex items-center gap-4'>
                <div className='flex size-12 items-center justify-center rounded-full bg-primary/10'>
                  <Mail className='size-6 text-primary' />
                </div>
                <div>
                  <p className='font-medium'>Email</p>
                  <p className='text-muted-foreground text-sm'>contato@dimipabos.org</p>
                </div>
              </div>
              <div className='flex items-center gap-4'>
                <div className='flex size-12 items-center justify-center rounded-full bg-secondary/10'>
                  <Phone className='size-6 text-secondary' />
                </div>
                <div>
                  <p className='font-medium'>Telefone</p>
                  <p className='text-muted-foreground text-sm'>+31 631 791 165</p>
                </div>
              </div>
              <div className='flex items-center gap-4'>
                <div className='flex size-12 items-center justify-center rounded-full bg-accent/10'>
                  <MapPin className='size-6 text-accent-foreground' />
                </div>
                <div>
                  <p className='font-medium'>Endereço</p>
                  <p className='text-muted-foreground text-sm'>Bissau, Guiné-Bissau</p>
                </div>
              </div>
            </div>
          </div>
        </HeroCardSection>
      </HeroWrapper>

      {/* Contact Form and Information */}
      <section id='enviar-mensagem' className='scroll-mt-8 py-16'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='grid gap-12 lg:grid-cols-2'>
            {/* Contact Form */}
            <div>
              <SectionTitle>Envie uma Mensagem</SectionTitle>

              <SectionDescription className='mx-0'>
                Preencha o formulário abaixo para entrar em contato conosco. Responderemos o mais
                breve possível.
              </SectionDescription>

              <div className='mt-8'>
                <ContactForm />
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className='font-bold text-2xl text-foreground tracking-tight'>
                Outras Formas de Contato
              </h2>
              <div className='mt-8 space-y-8'>
                <Card>
                  <CardContent className='flex items-start gap-4 p-6'>
                    <Mail className='size text-secondary' />
                    <div>
                      <h3 className='font-semibold'>E-mail</h3>
                      <p className='mt-1 text-muted-foreground'>contato@dimipabos.org</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className='flex items-start gap-4 p-6'>
                    <Phone className='size text-secondary' />
                    <div>
                      <h3 className='font-semibold'>Telefone</h3>
                      <p className='mt-1 text-muted-foreground'>+31 631 791 165</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className='flex items-start gap-4 p-6'>
                    <MapPin className='size-6 text-secondary' />
                    <div>
                      <h3 className='font-semibold'>Endereço</h3>
                      <p className='mt-1 text-muted-foreground'>Guiné-Bissau</p>
                    </div>
                  </CardContent>
                </Card>

                <div className='space-y-4'>
                  <h3 className='font-semibold'>Redes Sociais</h3>
                  <div className='flex gap-4'>
                    <Button
                      render={
                        <a
                          target='_blank'
                          rel='noopener noreferrer'
                          href='https://www.facebook.com/profile.php?id=100090763747200'
                          className='hover:text-secondary'
                        />
                      }
                      nativeButton={false}
                      variant='outline'
                      size='icon'
                    >
                      <Facebook className='size-6' />
                      <span className='sr-only'>Facebook</span>
                    </Button>
                    <Button
                      render={
                        <a
                          target='_blank'
                          rel='noopener noreferrer'
                          href='https://wa.me/31631791165'
                          className='hover:text-secondary'
                        />
                      }
                      nativeButton={false}
                      variant='outline'
                      size='icon'
                    >
                      <MessageCircle className='size-6' />
                      <span className='sr-only'>WhatsApp</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection className='border-b' />
    </div>
  )
}
