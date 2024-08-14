import { RxCheckCircled } from "react-icons/rx";

const AuthSuccessPage: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-screen"
      style={{
        backgroundImage: 'url(/login-bg.webp)', // Substitua com o caminho da sua imagem
        backgroundSize: 'cover', // Ajusta a imagem para cobrir toda a área
        backgroundPosition: 'center', // Centraliza a imagem
        backgroundRepeat: 'no-repeat' // Não repete a imagem
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: 'var(--login-bg)' // Substitua a cor e a transparência conforme necessário
        }}
      ></div>

      <div className="relative w-100 p-8 rounded-lg shadow-md bg-color_sec text-center text-color_text">
        <div className="flex items-center gap-2 bg-green-600 rounded-lg p-4">
          <RxCheckCircled className="icon" />

          <p>{"Success! Please check your email inbox for sign in link."}</p>
        </div>

        <div className="mt-4">
          <p>
            {
              "Didn't receive an email? To go back to the sign-in page and try again, "
            }

            <a
              href="/api/auth/signin"
              style={{ cursor: "pointer", textDecoration: "underline" }}
            >
              Click Here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthSuccessPage;