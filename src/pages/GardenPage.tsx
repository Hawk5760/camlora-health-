import { SoulGarden } from "@/components/SoulGarden";
import { useTranslation } from 'react-i18next';

export const GardenPage = () => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gradient-soul">
            {t('pages.garden.title')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('pages.garden.subtitle')}
          </p>
        </div>

        <SoulGarden />
      </div>
    </div>
  );
};