import AuthForm from '../../../components/AuthForm'

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cover bg-center"
         style={{ backgroundImage: 'url("/background.jpg")' }}>
      <div className="glass-box p-8 rounded-2xl w-full max-w-md z-10">
        <AuthForm mode="forgot" />
      </div>
    </div>
  )
}