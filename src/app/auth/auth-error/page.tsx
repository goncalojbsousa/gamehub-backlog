import { RxExclamationTriangle } from "react-icons/rx";

const AuthErrorPage: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-100 p-8 rounded-lg shadow-md bg-white text-center">
        <div className="flex items-center gap-2 bg-red-200 rounded-lg p-4">
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

