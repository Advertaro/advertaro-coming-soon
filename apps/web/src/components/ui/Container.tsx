import { cn } from '@advertaro/ui'
import type { ComponentPropsWithoutRef, ElementType } from 'react'

type ContainerProps = ComponentPropsWithoutRef<'div'> & { as?: ElementType }

export function Container({ as: Tag = 'div', className, ...props }: ContainerProps) {
  return <Tag className={cn('mx-auto w-full max-w-site px-5 sm:px-8', className)} {...props} />
}
