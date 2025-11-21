import { JSX } from 'solid-js'

export interface ImageDropState {
  error: string | null
  loading: boolean
  file: File
  croppedImage: string | null
}

export interface ImageDropProps {
  /** Callback function called when the user saves the cropped image */
  saveImage: (state: ImageDropState) => void
  /** Initial aspect ratio width (optional, default: 1) */
  aspectRatioWidth?: number
  /** Initial aspect ratio height (optional, default: 1) */
  aspectRatioHeight?: number
  /** Array of accepted file MIME types (optional, default: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']) */
  acceptedFileTypes?: string[]
  /** Maximum file size in megabytes (optional, default: 10) */
  maxFileSizeMB?: number
  /** Callback function called when an error occurs (optional) */
  onError?: (message: string) => void
}

export default function ImageDrop(props: ImageDropProps): JSX.Element
