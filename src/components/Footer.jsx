const Footer = ({footerRef}) => {
    return(
        <section id="footer">
            <div className="w-full bg-gradient-to-b from-gray-300 to-gray-200 mt-8" ref={footerRef}>
                <div className="innerWrapper py-2 flex justify-between flex-wrap text-center">
                    <div id="footerLeft" className="p-2 max-[400px]:w-full">BillEase</div>
                    <div id="footerRight" className="p-2 max-[400px]:w-full">
                        Developed by - Taha Khan
                    </div>
                </div>
            </div>
        </section>
    );
}
export default Footer;