import Header from "@/components/Header";
import AccountContent from "./components/AccountContent";

const Acoount = () => {
    return (
        <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
            <Header className="from-bg-neutral-900">
                <div className="mb-2 flex flex-col gap-y-6">
                    <h1 className="text-white text-3xl font-semibold">
                        Account Settings
                    </h1>
                </div>
            </Header>
            <AccountContent />
            <footer className="bg-grey w-full bottom-0 flex py-40">
                <div className="mx-auto">
                    <p className="text-white px-5">
                        &copy; 2023 All rights reserved || Developed by AfroTech
                    </p>
                </div>
            </footer>
        </div>
    )
}

export default Acoount;