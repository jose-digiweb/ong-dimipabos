'use client'

import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface ImageGalleryProps {
	images: string[]
}

export function ImageGallery({ images }: ImageGalleryProps) {
	const [currentImage, setCurrentImage] = useState(0)
	const [showLightbox, setShowLightbox] = useState(false)

	const nextImage = () => {
		setCurrentImage((prev) => (prev + 1) % images.length)
	}

	const previousImage = () => {
		setCurrentImage((prev) => (prev - 1 + images.length) % images.length)
	}

	return (
		<>
			<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
				{images.map((image, index) => (
					<Card
						key={index}
						className='group relative aspect-4/3 cursor-pointer overflow-hidden'
						onClick={() => {
							setCurrentImage(index)
							setShowLightbox(true)
						}}
					>
						<Image
							src={image || '/placeholder.svg'}
							alt={`Imagem ${index + 1}`}
							fill
							className='object-cover transition-transform duration-300 group-hover:scale-105'
						/>
					</Card>
				))}
			</div>

			{showLightbox && (
				<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4'>
					<div className='relative max-h-[90vh] max-w-[90vw]'>
						<Button
							variant='ghost'
							size='icon'
							className='absolute top-4 right-4 text-white hover:bg-white/20'
							onClick={() => setShowLightbox(false)}
						>
							<X className='h-6 w-6' />
						</Button>
						<div className='relative aspect-4/3 min-h-[300px] w-full min-w-[300px] md:min-h-[500px] md:min-w-[500px]'>
							<Image
								src={images[currentImage] || '/placeholder.svg'}
								alt={`Imagem ${currentImage + 1}`}
								fill
								className='object-contain'
							/>
						</div>
						<div className='absolute inset-y-0 left-4 flex items-center'>
							<Button
								variant='ghost'
								size='icon'
								className='text-white hover:bg-white/20'
								onClick={(e) => {
									e.stopPropagation()
									previousImage()
								}}
							>
								<ChevronLeft className='h-8 w-8' />
							</Button>
						</div>
						<div className='absolute inset-y-0 right-4 flex items-center'>
							<Button
								variant='ghost'
								size='icon'
								className='text-white hover:bg-white/20'
								onClick={(e) => {
									e.stopPropagation()
									nextImage()
								}}
							>
								<ChevronRight className='h-8 w-8' />
							</Button>
						</div>
					</div>
				</div>
			)}
		</>
	)
}
