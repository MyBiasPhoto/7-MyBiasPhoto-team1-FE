import LoginModal from "@/components/modals/loginModal";
import SellPhotoModal from "@/components/modals/sellPhotoModal";

export default function LoginModalWrapper({ isOpen, isLoggedIn, onClose }) {
  if (!isOpen) return null;
  return isLoggedIn ? (
    <SellPhotoModal onClose={onClose} />
  ) : (
    <LoginModal onClose={onClose} />
  );
}
