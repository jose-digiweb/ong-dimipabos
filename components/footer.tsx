import { Facebook, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import Link from 'next/link'

/**
 * The {@link footerRoute} constant
 * @description Internal routes referenced from the footer
 */
const footerRoute = {
  SOBRE: '/sobre',
  PROJETOS: '/projetos',
  DOAR: '/como-ajudar/doar',
  VOLUNTARIO: '/como-ajudar/voluntario',
  PARCEIROS: '/como-ajudar/parceiros',
  PRIVACY: '/politica-de-privacidade',
  TERMS: '/termos',
} as const

/**
 * The {@link footerContact} constant
 * @description Contact details surfaced in the footer
 */
const footerContact = {
  LOCATION: 'Bissau, Guiné-Bissau',
  PHONE: '+31 631 791 165',
  EMAIL: 'contact@ongdimipabos.org',
  FACEBOOK_URL: 'https://www.facebook.com/profile.php?id=100090763747200',
  WHATSAPP_URL: 'https://wa.me/31631791165',
} as const

/**
 * The {@link footerLegal} constant
 * @description Legal identification of the organization surfaced in the footer
 */
const footerLegal = {
  LEGAL_NAME: 'ONG DI MI PA BÔS',
  NIPC_LABEL: 'NIPC:',
  NIPC_VALUE: '910324840',
} as const

/**
 * The {@link footerCopy} constant
 * @description Static Portuguese copy used in the footer
 */
const footerCopy = {
  ABOUT_TITLE: 'Sobre Nós',
  ABOUT_BODY:
    'A DI MI PA BÔS é uma ONG dedicada a transformar vidas através de habitação, cuidado e serviços essenciais na Guiné-Bissau.',
  QUICK_LINKS_TITLE: 'Links Rápidos',
  LINK_SOBRE: 'Nossa História',
  LINK_PROJETOS: 'Projetos',
  LINK_DOAR: 'Doe',
  LINK_VOLUNTARIO: 'Seja Voluntário',
  LINK_PARCEIROS: 'Seja Parceiro',
  CONTACT_TITLE: 'Contato',
  LEGAL_TITLE: 'Legal',
  LINK_PRIVACY: 'Política de Privacidade',
  LINK_TERMS: 'Termos e Condições',
  FACEBOOK_LABEL: 'Facebook',
  WHATSAPP_LABEL: 'WhatsApp',
  ORG_NAME: 'DI MI PA BÔS',
  RIGHTS_RESERVED: 'Todos os direitos reservados.',
} as const

/**
 * The {@link Footer} component
 * @description Renders the global site footer with about copy, quick links and contact info
 * @returns The rendered footer
 */
export function Footer() {
  // Resolve the current year once per render
  const currentYear = new Date().getFullYear()

  // Render the three-column footer layout
  return (
    <footer className='bg-primary text-primary-foreground'>
      <div className='mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4'>
          <div>
            <h3 className='font-semibold text-lg'>{footerCopy.ABOUT_TITLE}</h3>
            <p className='mt-4 text-primary-foreground text-sm'>{footerCopy.ABOUT_BODY}</p>
          </div>
          <div>
            <h3 className='font-semibold text-lg'>{footerCopy.QUICK_LINKS_TITLE}</h3>
            <ul className='mt-4 space-y-2 text-sm'>
              <li>
                <Link href={footerRoute.SOBRE} className='hover:text-primary-foreground'>
                  {footerCopy.LINK_SOBRE}
                </Link>
              </li>
              <li>
                <Link href={footerRoute.PROJETOS} className='hover:text-primary-foreground'>
                  {footerCopy.LINK_PROJETOS}
                </Link>
              </li>
              <li>
                <Link href={footerRoute.DOAR} className='hover:text-primary-foreground'>
                  {footerCopy.LINK_DOAR}
                </Link>
              </li>
              <li>
                <Link href={footerRoute.VOLUNTARIO} className='hover:text-primary-foreground'>
                  {footerCopy.LINK_VOLUNTARIO}
                </Link>
              </li>
              <li>
                <Link href={footerRoute.PARCEIROS} className='hover:text-primary-foreground'>
                  {footerCopy.LINK_PARCEIROS}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className='font-semibold text-lg'>{footerCopy.CONTACT_TITLE}</h3>
            <ul className='mt-4 space-y-4 text-sm'>
              <li className='flex items-center gap-4'>
                <MapPin className='size-5' />
                {footerContact.LOCATION}
              </li>
              <li className='flex items-center gap-4'>
                <Phone className='size-5' />
                {footerContact.PHONE}
              </li>
              <li className='flex items-center gap-4'>
                <Mail className='size-5' />
                {footerContact.EMAIL}
              </li>
            </ul>
            <div className='mt-6 flex space-x-4'>
              <Link
                target='_blank'
                rel='noopener noreferrer'
                href={footerContact.FACEBOOK_URL}
                className='rounded-sm border p-1 hover:text-primary-foreground'
              >
                <Facebook className='size-6' />
                <span className='sr-only'>{footerCopy.FACEBOOK_LABEL}</span>
              </Link>
              <Link
                target='_blank'
                rel='noopener noreferrer'
                href={footerContact.WHATSAPP_URL}
                className='rounded-sm border p-1 hover:text-primary-foreground'
              >
                <MessageCircle className='size-6' />
                <span className='sr-only'>{footerCopy.WHATSAPP_LABEL}</span>
              </Link>
            </div>
          </div>
          <div>
            <h3 className='font-semibold text-lg'>{footerCopy.LEGAL_TITLE}</h3>
            <ul className='mt-4 space-y-2 text-sm'>
              <li>
                <Link href={footerRoute.PRIVACY} className='hover:text-primary-foreground'>
                  {footerCopy.LINK_PRIVACY}
                </Link>
              </li>
              <li>
                <Link href={footerRoute.TERMS} className='hover:text-primary-foreground'>
                  {footerCopy.LINK_TERMS}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className='mt-8 flex flex-col items-center gap-2 border-primary-foreground/10 border-t pt-8 text-center text-sm'>
          <p>
            {footerLegal.LEGAL_NAME} · {footerLegal.NIPC_LABEL} {footerLegal.NIPC_VALUE} ·{' '}
            {footerContact.LOCATION}
          </p>
          <p>
            &copy; {currentYear} {footerCopy.ORG_NAME}. {footerCopy.RIGHTS_RESERVED}
          </p>
        </div>
      </div>
    </footer>
  )
}
