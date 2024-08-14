import { RxExclamationTriangle } from "react-icons/rx";

const AuthErrorPage: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-screen text-color_text"
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

      <div className="relative w-100 p-8 rounded-lg shadow-md bg-color_sec text-center">
        <div className="flex items-center gap-2 bg-btn_logout rounded-lg p-4">
          <RxExclamationTriangle className="icon" />

          <p>{"Oops, something went wrong."}</p>
        </div>

        <div className="mt-4">
          <p>
            {"To go back to the sign in page, "}

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

export default AuthErrorPage;

