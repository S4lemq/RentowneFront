import { InavbarData } from "./helper";

export const navbarData: InavbarData[] = [
    {
        routeLink: 'dashboard',
        icon: 'fal fa-server',
        label: 'Pulpit'
    },
    {
        routeLink: 'apartments',
        icon: 'fal fa-home-lg-alt',
        label: 'Nieruchomości',
        items: [
            {
                routeLink: 'apartments',
                label: 'Lista nieruchomości'
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
        label: 'Dostawcy',
        items: [
            {
                routeLink: 'housing-providers',
                label: 'Lista dostawców'
            },
            {
                routeLink: 'housing-providers/add',
                label: 'Dodaj dostawcę'
            }
        ]
    },
    {
        routeLink: 'meters',
        icon: 'fal fa-tachometer-alt-fast',
        label: 'Liczniki',
        items: [
            {
                routeLink: 'meters',
                label: 'Lista liczników'
            },
            {
                routeLink: 'meters/add',
                label: 'Dodaj licznik'
            }
        ]
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
        label: 'Umowy',
        items: [
            {
                routeLink: 'agreements',
                label: 'Lista umów'
            },
            {
                routeLink: 'agreements/add',
                label: 'Dodaj umowę'
            }
        ]
    },
];