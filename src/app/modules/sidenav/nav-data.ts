import { InavbarData } from "./helper";

export const navbarData: InavbarData[] = [
    {
        routeLink: 'apartments',
        icon: 'fal fa-home-lg-alt',
        label: 'Nieruchomości',
        items: [
            {
                routeLink: 'apartments',
                label: 'Nieruchomości'
            },
            {
                routeLink: 'apartments/add',
                label: 'Dodaj nieruchomość'
            }
        ]
    },
    {
        routeLink: 'tenants',
        icon: 'fal fa-user-friends',
        label: 'Najemcy'
    },
    {
        routeLink: 'utility-providers',
        icon: 'fal fa-address-card',
        label: 'Dostawcy'
    },
    {
        routeLink: 'meters',
        icon: 'fal fa-tachometer-alt-fast',
        label: 'Liczniki'
    },
    {
        routeLink: 'finances',
        icon: 'fal fa-money-bill-wave',
        label: 'Finanse'
    },
    {
        routeLink: 'analytics',
        icon: 'fal fa-chart-line',
        label: 'Analizy'
    },
    {
        routeLink: 'agreements',
        icon: 'fal fa-copy',
        label: 'Umowy'
    },
    {
        routeLink: 'settings',
        icon: 'fal fa-cog',
        label: 'Ustawienia',
        expanded: true,
        items: [
            {
                routeLink: 'settings',
                label: 'Profil'
            },
            {
                routeLink: 'settings/customize',
                label: 'Personalizuj'
            }
        ]
    },
    
/*     {
        routeLink: 'dashboard',
        icon: 'fal fa-money-bill-wave',
        label: 'Dashboard'
    } */

];