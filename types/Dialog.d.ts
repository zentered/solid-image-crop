type DialogProps = {
  title: String
  isOpen: Function
  closeModal: Function
  openModal: Function
  saveImage: Function
}

export default function ImageUploadDialog(props: DialogProps): void
