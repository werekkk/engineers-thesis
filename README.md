# Engineer's Thesis
[![CircleCI](https://circleci.com/gh/werekkk/engineers-thesis.svg?style=svg&circle-token=0cad18935bac5ee0aad15d9d2dcae8dc82b4e814)](https://circleci.com/gh/werekkk/engineers-thesis)

## Wstęp
Repozytorium zawiera kod źródłowy systemu będącego przedmiotem mojej pracy inżynierskiej. System jest aplikacją webową stworzoną z wykorzystaniem technologii Angular i Spring Boot (z bazą danych PostgreSQL). System został wdrożony na zewnętrzny serwer www i jest dostępny na stronie [jwer.pl/praca-inzynierska](http://www.jwer.pl/praca-inzynierska)

System umożliwia:
* Utworzenie konta pracodawcy – osoby zarządzającej zakładem pracy
* Zarządzanie listą pracowników przez pracodawcę
* Utworzenie konta pracownika za pomocą linku aktywacyjnego wygenerowanego dla pracodawcy
* Zarządzanie przez pracodawcę listą stanowisk w zakładzie pracy
* Przypisywanie przez pracodawcę stanowisk pracownikom
* Ręczne tworzenie grafiku przez pracodawcę – wyznaczanie zmian pracownikom na konkretnych stanowiskach w określonych godzinach
* Przeglądanie grafiku całego zakładu pracy przez pracodawcę
* Przeglądanie własnego grafiku przez pracownika
* Określanie przez pracowników swoich preferencji godzinowych – przedziałów godzinowych w których pracownik może (chętnie albo niechętnie) lub nie może stawić się w pracy
* Określanie przez pracodawcę obsady stanowiska – wymaganej liczby pracowników na danym stanowisku, w dany dzień tygodnia, w określonych przedziałach godzinowych
* Automatyczne generowanie grafiku uwzględniające określoną obsadę stanowisk i preferencje godzinowe pracowników
* Przeglądanie przez pracodawcę statystyk dotyczących liczby przepracowanych godzin wyliczanych na podstawie zmian zapisanych w grafiku

## Uruchamianie
Przed zbudowaniem i uruchomieniem systemu należy zainstalować odpowiednie narzędzia:
* Java (wersja 8 wzwyż)
* npm
* PostgreSQL (z możliwością wykonywania poleceń w linii komend - możliwość można sprawdzić poleceniem: ```psql --version```)

Aby uruchomić system należy wykonać następujące kroki:
1. Sklonowanie repozytorium:

    ```git clone https://github.com/werekkk/engineers-thesis.git```
    
2. Utworzenie odpowiedniej bazy danych w Postgresie:

    ```psql --username=<NAZWA UŻYTKOWNIKA POSTGRESQL> -c "create database <NAZWA BAZY DANYCH>;"```
    
    Przykładowo:
    
    ```psql --username=postgres -c "create database praca_inzynierska_wernikowski;"```
    
    Należy upewnić się, że użytkownik PostgreSQL posiada uprawnienia do tworzenia baz danych. Po wprowadzeniu powyższego polecenia PostgreSQL może poprosić o hasło użytkownika.
    
3. Ustawienie parametrów bazy danych:

    W pliku ```engineers-thesis\praca-inzynierska-backend\application\src\main\resources\application.properties``` należy ustawić odpowiednie wartości parametrów określających adres URL (zawierający nazwę bazy utworzonej w kroku 2.), login oraz hasło umożliwiające korzystanie z Postgresa - odpowiednie 2, 3 i 4 linia pliku.
    
4. Przetestowanie i zbudowanie aplikacji:

    Wejście do katalogu skopiowanego repozytorium:

    ``` cd engineers-thesis```

    Uruchomienie tasków Mavena:

    ```mvnw install```

    System jest budowany do pojedynczego pliku praca-inzynierska.war w katalogu /praca-inzynierska-backend/application/target/
  
  
5. Uruchomienie systemu:
  
    System można uruchomić na trzy sposoby:

     1. Wdrażając plik praca-inzynierska.war do kontenera aplikacji webowych (np. Tomcat).
     2. Uruchamiając aplikację z poziomu IDE (funkcja main w pliku jwer.backend.BackendApplikation.kt) - należy pamiętać o ustawieniu odpowiednich parametrów (url bazy, nazwa i hasło użytkownika Postgresa) w pliku application.properties w module application.
     3. Z lini poleceń:
     ```mvn spring-boot:run -pl jwer:engineers-thesis-application```
    
    Uruchomiona za pomocą sposobu 2. albo 3. aplikacja jest dostępna pod adresem [localhost:8080](http://localhost:8080/index.html)
    
    Po pierwszym uruchomieniu tworzone jest demonstracyjne konto pracodawcy (login: test, hasło: test) z przykładowymi danymi pracowników i stanowisk.
  

## Testy
  
Sporządzone testy systemu obejmowały między innymi funkcjonalności związane z prezentowanym pracodawcy widokiem pracowników (```/employer/employees```). Umożliwia on dodawanie i usuwanie pracowników i stanowisk oraz przypisywanie stanowisk poszczególnym pracownikom.
  
W części frontendowej testy zamieszczono w plikach:
  
* [employees-list.component.spec.ts](praca-inzynierska-frontend/src/app/app/components/employer/employees-list/employees-list.component.spec.ts) - komponent wyświetlający listę pracowników
* [employees-edit-employee-positions-modal.component.spec.ts](praca-inzynierska-frontend/src/app/app/components/employer/employees-edit-employee-positions-modal/employees-edit-employee-positions-modal.component.spec.ts) - okno umożliwiające przypisanie stanowisk pracownikowi
* [employees-edit-global-positions-modal.component.spec.ts](praca-inzynierska-frontend/src/app/app/components/employer/employees-edit-global-positions-modal/employees-edit-global-positions-modal.component.spec.ts) - okno umożliwiające edycję listy stanowisk w zakładzie pracy 
* [employees-new-employee-modal.component.spec.ts](praca-inzynierska-frontend/src/app/app/components/employer/employees-new-employee-modal/employees-new-employee-modal.component.spec.ts) - okno umożliwiające dodanie nowego pracownika

W części backendowej testy wykonywane są na instancji tymczasowej bazy danych H2. Zamieszczono je w plikach:

* [EmployeeServiceTests.kt](praca-inzynierska-backend/application/src/test/kotlin/jwer/backend/EmployeeServiceTests.kt) - testowane są metody kontrolerów do pobierania, dodawania i usuwania pracowników.
* [PositionServiceTests.kt](praca-inzynierska-backend/application/src/test/kotlin/jwer/backend/PositionServiceTests.kt) - testowane są metody kontrolerów do dodawania, edytowania, usuwania i przypisywania stanowisk.

## Struktura projektu

Projekt jest podzielony na część frontendową (Angular) oraz backendową (Spring Boot - Kotlin).

Komponenty aplikacji frontendu podzielono pomiędzy 4 moduły:

* [main](praca-inzynierska-frontend/src/app/app/components/main) - zawierający widoki prezentowane niezalogowanym użytkownikom
* [employer](praca-inzynierska-frontend/src/app/app/components/employer) - zawierający widoki prezentowane zalogowanemu użytkownikowi z rolą pracodawcy
* [employee](praca-inzynierska-frontend/src/app/app/components/employee) - zawierający widoki prezentowane zalogowanemu użytkownikowi z rolą pracownika
* [shared](praca-inzynierska-frontend/src/app/app/components/shared) - zawierający komponenty wykorzystywane w więcej niż jednym module

Logikę aplikacji backendu podzielono na 2 moduły:

* [application](praca-inzynierska-backend/application) - odpowiedzialny za odpowiadanie na żądania frontendu, realizację logiki biznesowej oraz kontakt z bazą danych
* [schedule-generator](praca-inzynierska-backend/schedule-generator) - umożliwia automatyczne generowanie grafików z wykorzystaniem metaheurystyki symulowanego wyżarzania na podstawie zadanej konfiguracji wejściowej 


Jacek Wernikowski
