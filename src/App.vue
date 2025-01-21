<template>
	<div class="relative">
		<!-- Header z dynamicznym tłem (bez zmian) -->
		<header
			:class="[
				'fixed top-0 left-0 w-full z-30 transition-colors duration-200',
				scrolled ? 'bg-white text-gray-800 shadow' : 'bg-transparent text-white',
			]">
			<div class="max-w-[90%] mx-auto grid grid-cols-3 items-center p-4">
				<!-- Lewa kolumna: przycisk Menu -->
				<div class="flex items-center">
					<button class="flex items-center text-current text-lg" @click="toggleMenu">
						<span class="mr-2">
							<i class="fa-solid fa-bars"></i>
						</span>
						Menu
					</button>
				</div>

				<!-- Środek: tytuł strony -->
				<h1 class="text-center text-lg sm:text-xl font-bold">Pod zielonym kogutem</h1>

				<!-- Prawa kolumna: telefon + przycisk Rezerwuj -->
				<div class="flex justify-end items-center space-x-4">
					<div class="flex items-center">
						<span class="mr-2"><i class="fa-solid fa-phone"></i></span>
						<a
							href="tel:696560733"
							class="no-underline text-inherit hover:text-green-500 transition-colors duration-200">
							696 560 733
						</a>
					</div>
					<a
						href="#reservation"
						class="px-4 py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-600 transition-colors duration-200 no-underline">
						Rezerwuj
					</a>
				</div>
			</div>
		</header>

		<!-- Pełnoekranowe menu (overlay) -->
		<transition name="fade">
			<div
				v-if="isMenuOpen"
				class="fixed inset-0 z-50 bg-black bg-opacity-95 text-white flex flex-col"
				@click.self="closeMenu">
				<button class="text-3xl absolute top-6 right-6" @click="closeMenu">
					<i class="fa-solid fa-times"></i>
				</button>
				<nav class="m-auto text-center text-4xl space-y-8">
					<a href="#carousel" @click="closeMenu" class="block no-underline hover:text-gray-400"> Home </a>
					<a
						href="#reservation"
						@click="closeMenu"
						class="block no-underline hover:text-gray-400 transition-colors duration-200">
						Rezerwacja
					</a>
					<a
						href="#gallery"
						@click="closeMenu"
						class="block no-underline hover:text-gray-400 transition-colors duration-200">
						Galeria
					</a>
					<a
						href="#contact"
						@click="closeMenu"
						class="block no-underline hover:text-gray-400 transition-colors duration-200">
						Kontakt
					</a>
				</nav>
			</div>
		</transition>

		<!-- Pionowa nawigacja kropkowa (dot navigation) -->
		<div class="hidden md:flex flex-col items-center fixed top-1/2 right-8 -translate-y-1/2 z-50 space-y-4">
			<div v-for="item in navItems" :key="item.id" class="relative flex items-center">
				<!-- Etykieta sekcji (oprócz hero) wyświetla się TYLKO, gdy kropka jest aktywna -->
				<div
					v-if="activeSection === item.id && item.id !== 'carousel'"
					class="absolute right-full mr-2 text-base text-green-700 px-2 py-1 bg-white border-2 border-green-700 rounded whitespace-nowrap">
					{{ item.name }}
				</div>

				<!-- Kółko (kropka) - wypełniona, jeśli activeSection === item.id -->
				<a
					:href="'#' + item.id"
					:title="item.name"
					:class="[
						'block w-5 h-5 rounded-full border-2 border-green-600 bg-white hover:bg-green-500 transition-colors',
						activeSection === item.id ? 'bg-green-500' : '',
					]"></a>
			</div>
		</div>

		<!-- Sekcja hero: karuzela na pełnym ekranie -->
		<section id="carousel" class="relative w-full h-screen flex items-center justify-center overflow-hidden">
			<Splide :options="splideOptions" class="absolute inset-0">
				<SplideSlide v-for="(slide, i) in slides" :key="i" class="relative w-full h-full overflow-hidden">
					<img :src="slide.src" :alt="slide.title" class="w-full h-full object-cover" />
					<div class="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
						<h2 class="text-white text-4xl sm:text-5xl font-bold text-center">
							{{ slide.title }}
						</h2>
					</div>
				</SplideSlide>
			</Splide>
		</section>

		<!-- Sekcja Rezerwacja (custom tabela) -->
		<section id="reservation" class="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 py-8">
			<div class="max-w-4xl w-full text-center space-y-6">
				<h2 class="text-4xl sm:text-5xl font-bold">Rezerwacja toru</h2>
				<p class="text-lg sm:text-xl text-gray-700">Wybierz godzinę (12–22) i tor. Możesz też zmieniać dni.</p>

				<!-- Nawigacja dni -->
				<div class="flex items-center justify-center space-x-4">
					<button class="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600 transition" @click="prevDay">
						Poprzedni dzień
					</button>
					<div class="text-lg font-semibold">
						{{ formattedDate }}
					</div>
					<button class="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600 transition" @click="nextDay">
						Następny dzień
					</button>
				</div>

				<!-- Tabela z 2 wierszami (Tor1, Tor2) i godzinami 12–22 w kolumnach -->
				<div class="overflow-x-auto">
					<table class="mx-auto border border-gray-300 text-center shadow-lg">
						<thead class="bg-gray-200">
							<tr>
								<th class="p-3 border-r border-b border-gray-300">Tor / Godzina</th>
								<th v-for="hour in hours" :key="hour" class="p-3 border-r border-b border-gray-300 w-24">
									{{ hour }}:00
								</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="resource in resources" :key="resource.id" class="border-b border-gray-300">
								<td class="p-3 border-r border-gray-300 font-semibold bg-white">
									{{ resource.name }}
								</td>
								<td
									v-for="hour in hours"
									:key="hour"
									class="p-3 border-r border-gray-300 cursor-pointer hover:bg-green-100"
									@click="reserveSlot(resource, hour)">
									Wolne
									<!-- W realnym projekcie sprawdzisz w bazie,
                   czy dany slot jest wolny / zajęty -->
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</section>

		<!-- Sekcja Galeria -->
		<section id="gallery" class="min-h-screen flex items-center justify-center bg-gray-50">
			<div class="max-w-[85%] mx-auto p-4">
				<h2 class="text-3xl font-bold text-center mb-8">Galeria</h2>
				<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
					<div
						v-for="(img, idx) in galleryImages"
						:key="idx"
						class="cursor-pointer group relative overflow-hidden"
						@click="openLightbox(idx)">
						<img
							:src="img.src"
							:alt="img.alt"
							class="w-full h-auto object-cover rounded shadow transition duration-300 ease-in-out hover:brightness-75" />
					</div>
				</div>

				<!-- Lightbox -->
				<transition name="lightbox-fade">
					<VueEasyLightbox
						v-if="lightboxOpen"
						:visible="lightboxOpen"
						:imgs="galleryImages.map(img => img.src)"
						:index="lightboxIndex"
						@hide="closeLightbox" />
				</transition>
			</div>
		</section>

		<!-- Sekcja Kontakt -->
		<section id="contact" class="min-h-screen py-16 bg-gray-200 flex items-center justify-center px-4">
			<div class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
				<!-- Lewa kolumna: dane kontaktowe -->
				<div class="space-y-6 px-4">
					<h2 class="text-4xl font-extrabold text-gray-800">Skontaktuj się z nami</h2>
					<p class="text-lg text-gray-700 leading-relaxed">
						Masz pytania? Chętnie pomożemy i udzielimy wszelkich informacji. Możesz skontaktować się z nami
						telefonicznie, mailowo lub odwiedzić nas na miejscu.
					</p>

					<div class="space-y-4 text-xl text-gray-800">
						<!-- Numer telefonu -->
						<div class="flex items-center space-x-3">
							<i class="fa-solid fa-phone text-2xl"></i>
							<a href="tel:696560733" class="hover:text-green-500 transition-colors duration-200">696 560 733</a>
						</div>

						<!-- Adres e-mail -->
						<div class="flex items-center space-x-3">
							<i class="fa-solid fa-envelope text-2xl"></i>
							<a href="mailto:kregle.nysa@o2.pl" class="hover:text-red-500 transition-colors duration-200"
								>kregle.nysa@o2.pl</a
							>
						</div>

						<!-- Adres -->
						<div class="flex items-center space-x-3">
							<i class="fa-solid fa-location-dot text-2xl"></i>
							<address class="not-italic">Prudnicka 12, 48-304 Nysa</address>
						</div>

						<!-- Godziny otwarcia -->
						<div class="flex items-center space-x-3">
							<i class="fa-solid fa-clock text-2xl"></i>
							<div>
								<div>
									<strong class="font-semibold">Niedziela - Czwartek:</strong>
									16:00 - 01:00
								</div>
								<div>
									<strong class="font-semibold">Piątek - Sobota:</strong>
									16:00 - 02:00
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Prawa kolumna: duża mapa -->
				<div class="relative w-full h-[600px]">
					<iframe
						src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2539.4730948865717!2d17.334589413302336!3d50.46953577147744!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4711c406d2aeb04f%3A0x834bd7608171cd5e!2sPod%20Zielonym%20Kogutem!5e0!3m2!1spl!2spl!4v1737469992545!5m2!1spl!2spl"
						class="absolute top-0 left-0 w-full h-full"
						style="border: 0"
						allowfullscreen
						loading="lazy"
						referrerpolicy="no-referrer-when-downgrade"></iframe>
				</div>
			</div>
		</section>

		<!-- Stopka -->
		<footer class="bg-gray-800 text-white py-6">
			<!-- Bez zmian -->
			<div class="max-w-[90%] mx-auto p-4 text-center">
				<p>© 2025 Pod zielonym kogutem. Wszelkie prawa zastrzeżone.</p>
				<p class="text-sm mt-1">
					Projekt i realizacja:
					<a href="https://twoja-strona.pl" class="no-underline transition-colors duration-200"> twoja-strona.pl </a>
				</p>
			</div>
		</footer>
	</div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { Splide, SplideSlide } from '@splidejs/vue-splide'
import VueEasyLightbox from 'vue-easy-lightbox'

/* Lightbox */
const lightboxOpen = ref(false)
const lightboxIndex = ref(0)
function openLightbox(idx) {
	lightboxIndex.value = idx
	lightboxOpen.value = true
}
function closeLightbox() {
	lightboxOpen.value = false
}

/* Karuzela hero */
const slides = ref([
	{ title: 'Drink bar', src: '/images/bar.webp' },
	{ title: 'Bilard', src: '/images/bilard.webp' },
	{ title: 'Bowling', src: '/images/bowling.webp' },
])
const splideOptions = {
	type: 'loop',
	perPage: 1,
	autoplay: true,
	interval: 4000,
	pauseOnHover: false,
	pauseOnFocus: false,
	rewind: true,
	speed: 1000,
	arrows: false,
	pagination: true,
}

/* Galeria */
const galleryImages = [
	{ src: '/images/gallery1.webp', alt: 'Galeria 1' },
	{ src: '/images/gallery2.webp', alt: 'Galeria 2' },
	{ src: '/images/gallery3.webp', alt: 'Galeria 3' },
	{ src: '/images/gallery4.webp', alt: 'Galeria 4' },
	{ src: '/images/gallery5.webp', alt: 'Galeria 5' },
]

/* Menu overlay */
const isMenuOpen = ref(false)
function toggleMenu() {
	isMenuOpen.value = !isMenuOpen.value
}
function closeMenu() {
	isMenuOpen.value = false
}

/* Header - zmiana tła po scrollu */
const scrolled = ref(false)
function handleScroll() {
	const hero = document.getElementById('carousel')
	if (hero) {
		scrolled.value = window.scrollY > hero.offsetHeight - 80
	}
}
onMounted(() => {
	window.addEventListener('scroll', handleScroll)
	handleScroll()
})
onBeforeUnmount(() => {
	window.removeEventListener('scroll', handleScroll)
})

/* Dot navigation - IntersectionObserver */
const activeSection = ref('')
const navItems = [
	{ id: 'carousel', name: 'Strona główna' },
	{ id: 'reservation', name: 'Rezerwacja' },
	{ id: 'gallery', name: 'Galeria' },
	{ id: 'contact', name: 'Kontakt' },
]
let observer
function handleIntersect(entries) {
	entries.forEach(entry => {
		if (entry.isIntersecting) {
			activeSection.value = entry.target.id
		}
	})
}
onMounted(() => {
	const options = {
		root: null,
		rootMargin: '0px',
		threshold: 0.4,
	}
	observer = new IntersectionObserver(handleIntersect, options)
	navItems.forEach(item => {
		const el = document.getElementById(item.id)
		if (el) observer.observe(el)
	})
})
onBeforeUnmount(() => {
	if (observer) observer.disconnect()
})

/* ------ Custom "Kalendarz" Rezerwacja ------ */

// 2 tory
const resources = [
	{ id: 'tor1', name: 'Tor 1' },
	{ id: 'tor2', name: 'Tor 2' },
]

// godziny 12..21 => [12,13,...,21]
const hours = []
for (let h = 12; h < 22; h++) {
	hours.push(h)
}

// Dzień wybrany (domyślnie dzisiaj)
const selectedDate = ref(new Date())

// Format wyświetlenia daty (yyyy-mm-dd)
const formattedDate = computed(() => {
	const y = selectedDate.value.getFullYear()
	const m = String(selectedDate.value.getMonth() + 1).padStart(2, '0')
	const d = String(selectedDate.value.getDate()).padStart(2, '0')
	return `${y}-${m}-${d}`
})

// Zmiana dnia
function prevDay() {
	selectedDate.value = new Date(selectedDate.value.getTime() - 86400000) // 1 dzień mniej
}
function nextDay() {
	selectedDate.value = new Date(selectedDate.value.getTime() + 86400000) // 1 dzień więcej
}

// Kliknięcie w slot (resource = tor, hour = godzina)
function reserveSlot(resource, hour) {
	alert(`Rezerwujesz ${resource.name} w dniu ${formattedDate.value} o godz. ${hour}:00`)
	// W praktyce: otwarcie formularza, zapytanie do backendu, itp.
}
</script>

<style scoped>
/* Animacja fade dla pełnoekranowego menu */
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}

/* Lightbox - płynne pojawianie się i znikanie */
.lightbox-fade-enter-active,
.lightbox-fade-leave-active {
	transition: opacity 0.4s ease;
}
.lightbox-fade-enter-from,
.lightbox-fade-leave-to {
	opacity: 0;
}

/* Usunięcie podkreśleń linków */
a {
	text-decoration: none;
}
a:hover {
	text-decoration: none;
}
</style>
