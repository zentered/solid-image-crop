import { JSX, Accessor } from 'solid-js'
import { ImageDropState } from './ImageDrop'

export interface DialogProps {
  /** Title displayed in the dialog header */
  title: string
  /** Accessor function that returns whether the dialog is open */
  isOpen: Accessor<boolean>
  /** Callback function to close the dialog */
  closeModal: () => void
  /** Callback function to open the dialog */
  openModal: () => void
  /** Callback function called when the user saves the cropped image */
  saveImage: (state: ImageDropState) => void
}

export default function ImageUploadDialog(props: DialogProps): JSX.Element
