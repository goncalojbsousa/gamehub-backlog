'use client'

import { SignOutButton } from "@/src/components/sign-out-button";
import { getAccountLinkStatus } from "@/src/lib/auth/getAccountLinkStatusServer";
import { getUserName } from "@/src/lib/auth/getUserNameServerAction";
import { handleGoogleSignIn } from "@/src/lib/auth/googleSignInServerAction";
import { unlinkGoogleAccount } from "@/src/lib/auth/unlinkGoogleAccountServerAction";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getUserRole } from "@/src/lib/auth/getUserRoleServerAction";
import { useRouter } from "next/navigation";
import { Navbar } from "@/src/components/navbar/navbar";
import { getUserImage } from "@/src/lib/auth/getUserImageServerAction";
import { useUser } from "@/src/context/userContext";

export const DashboardPage: React.FC = () => {
    const [isAccountLinked, setIsAccountLinked] = useState(false);
    const [role, setUserRole] = useState("");
    const { update } = useSession();
    const router = useRouter();

    const { username, userImage, setUsername, setUserImage } = useUser();


    useEffect(() => {
        const userInfo = async () => {
            const name = await getUserName();
            if (name) {
                setUsername(name);
            };

            const image = await getUserImage();
            if (image) {
                setUserImage(image);
            };

            const role = await getUserRole();
            if (role) {
                setUserRole(role);
            };
        };

        const accountLinkStatus = async () => {
            try {
                const accountLinkStatus = await getAccountLinkStatus();
                setIsAccountLinked(accountLinkStatus);
            } catch (error) {
                console.error("Failed to get account link status:", error);
            };
        };

        userInfo();
        accountLinkStatus();
    }, []);

    return (
        <main>
            <Navbar />
            <div className="flex flex-col justify-center items-center mt-10">
                <h2 className="text-xl mb-4">Dashboard</h2>
                <div className="flex flex-col justify-center items-center w-80 p-8 rounded-lg shadow-md bg-white text-center">
                    <div className="mb-4 flex flex-col justify-center items-center">
                        <h1 className="text-lg">{username}</h1>
                        <p className="text-sm">Role: {role}</p>
                    </div>
                    <div>
                        <input
                            className="mb-4 px-4 py-2 rounded-lg border border-gray-300 hover:border-gray-400 focus:border-gray-400 focus:outline-none"
                            type="text"
                            placeholder={"Enter name"}
                            value={username}
                            onChange={(event) => setUsername(event.target.value)}
                        />
                        <button
                            className="w-full flex justify-center items-center px-4 py-2 rounded-lg border  text-orange-500 border-orange-300 hover:border-orange-400 focus:border-orange-400 focus:outline-none hover:bg-orange-100 hover:bg-opacity-50"
                            onClick={() => {
                                update({ name: username })
                            }}
                        >
                            Update Name
                        </button>
                    </div>
                    <div>
                        {role === "ADMIN"
                            ? <button
                                className="w-full mt-8 flex justify-center items-center px-4 py-2 rounded-lg border border-gray-300 hover:border-gray-400 focus:border-gray-400 focus:outline-none"
                                onClick={() => { router.push("/admin"); }}
                            >Admin Dashboard</button>
                            : null}
                    </div>
                    <div>
                        <button
                            className="w-full mt-8 mb-2 flex justify-center items-center px-4 py-2 rounded-lg border border-blue-300 hover:border-blue-400 focus:border-blue-400 focus:outline-none hover:bg-blue-100 hover:bg-opacity-50"
                            onClick={
                                isAccountLinked
                                    ? async () => {
                                        await unlinkGoogleAccount().then(() => {
                                            setIsAccountLinked(false);
                                        })
                                    }
                                    : async () => {
                                        await handleGoogleSignIn().then(() => {
                                            setIsAccountLinked(true);
                                        })
                                    }
                            }
                        >
                            {isAccountLinked
                                ? "Disconnect Google Account"
                                : "Connect Google Account"
                            }
                        </button>
                    </div>
                    <div>
                        <SignOutButton className="mt-2 flex items-center px-4 py-2 rounded-lg border border-red-300 hover:border-red-400 focus:border-red-400 focus:outline-none text-red-500 hover:bg-red-100 hover:bg-opacity-50" />
                    </div>
                </div>
            </div>
        </main>
    )
};