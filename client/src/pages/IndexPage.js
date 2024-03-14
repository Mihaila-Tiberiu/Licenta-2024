import CustomizableLocationCard from "../CustomizableLocationCard";
import Header from "../Header";

export default function IndexPage(){
    return(
      <div className="bg-gray-100 min-h-screen">
      
      <header className="bg-primary text-white text-center pt-5 pb-10">
        <div className="container mx-auto">
          
            <h2 className="text-4xl font-bold mb-4"> 
            <a href="#" className="hover:text-gray-300">Găsește locul ideal pentru ocazia ta.</a>
            </h2>
            <p className="text-lg">
            <a href="#" className="hover:text-gray-300">
            Descoperă locații inedite pentru evenimentele tale.</a>
            </p>
        </div>
      </header>
      <section className="container mx-auto py-10">
      <h2 className="text-4xl font-bold mb-4 flex justify-center text-primary"> Găsește locații minunate în orice oraș din România</h2>
        <div className="">
          <div>
            <h3 className="text-2xl font-semibold mb-4 mt-10 text-primary">
              <a href="/locatii?oras=București">
                <span className="hover:text-green-900">București</span>
              </a>
            </h3>
            <CustomizableLocationCard city={'București'} />
          </div>
          <div>
            <h3 className="text-2xl font-semibold mb-4 mt-10 text-primary">
              <a href="/locatii?oras=Cluj-Napoca">
                <span className="hover:text-green-900">Cluj-Napoca</span>
              </a>
            </h3>
            <CustomizableLocationCard city={'Cluj-Napoca'} />
          </div>
          <div>
            <h3 className="text-2xl font-semibold mb-4 mt-10 text-primary">
              <a href="/locatii?oras=Iași">
                <span className="hover:text-green-900">Iași</span>
              </a>
            </h3>
            <CustomizableLocationCard city={'Iași'} />
          </div>
          <div>
            <h3 className="text-2xl font-semibold mb-4 mt-10 text-primary">
              <a href="/locatii?oras=Constanța">
                <span className="hover:text-green-900">Constanța</span>
              </a>
            </h3>
            <CustomizableLocationCard city={'Constanța'} />
          </div>
          <div>
            <h3 className="text-2xl font-semibold mb-4 mt-10 text-primary">
              <a href="/locatii?oras=Timișoara">
                <span className="hover:text-green-900">Timișoara</span>
              </a>
            </h3>
            <CustomizableLocationCard city={'Timișoara'} />
          </div>
        </div>
      </section>
    </div>
    );
}