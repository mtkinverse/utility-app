const Hero = () => {
    return(
        <section id="hero">
            <div className="innerWrapper py-2">
                <div className="flex min-[750px]:flex-row flex-col items-center justify-evenly">
                    <div id="heroLeft" className="sm:max-w-[70%] h-full p-2">
                        <img 
                        // src="https://cdn.dribbble.com/users/2004171/screenshots/5646149/media/0293fa82c082ce0da448d01c2daacaa5.gif"
                        src={`${import.meta.env.BASE_URL}logoMine2.png`}
                        alt="A Greeting Picture"
                        className="w-full h-auto min-w-[50vw] 2xl:min-w-0"
                        />
                    </div>
                    <div id="heroRight" className="p-2 mx-2 sm:mx-0">
                        <h3 className="heading">Coming from mart ?</h3>
                        <p>
                            With a user-friendly interface and top-notch security, managing your bills has never been easier. Take control of your finances and experience stress-free bill management with BillEase. Use now and discover the ultimate utility app for your financial convenience.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
export default Hero;