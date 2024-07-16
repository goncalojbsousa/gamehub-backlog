import { RxCheckCircled } from "react-icons/rx";

const AuthSuccessPage: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-100 p-8 rounded-lg shadow-md bg-white text-center">
        <div className="flex items-center gap-2 bg-green-200 rounded-lg p-4">
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