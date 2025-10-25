from itertools import permutations
from typing import List, Tuple
import numpy as np
import openrouteservice as ors
import time

from src.ai import f

key = 'eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImJiMzM3ZGJiYTI1YTRkOGM5ZjYyNDIyOTIyYzRiYTk4IiwiaCI6Im11cm11cjY0In0='
client = ors.Client(key=key)

SERVICE_TIME = 5

example_addresses = [
    "Ростов-на-Дону, улица Варфоломеева, 260А",
    "Ростов-на-Дону, Будённовский проспект, 45",
    "Ростов-на-Дону, улица Малюгиной, 212",
    "переулок Скрыпника, 26, Ростов-на-Дону",
    "улица 26 Июня, 110, Ростов-на-Дону",
    "улица Александра Блока, 12, Ростов-на-Дону",
    "Черноморский переулок, 12, Ростов-на-Дону",
    "Петрозаводская улица, 108, Ростов-на-Дону",
    "Патриотическая улица, 19, Ростов-на-Дону",
]
example_working_times = [
    [(7 * 60, 22 * 60)],
    [(8 * 60, 13*60), (14*60, 20*60)],
    [(9 * 60, 22 * 60)],
    [(12 * 60, 22 * 60)],
    [(10 * 60, 22 * 60)],
    [(7 * 60, 14*60), (15*60, 20*60)],
    [(8 * 60, 22 * 60)],
    [(8 * 60, 22 * 60)],
    [(7 * 60, 22 * 60)]
]

def route_times(route: List[int], travel: np.ndarray, working_times: List[List[Tuple[int,int]]], depot:int=0) -> Tuple[List[int], int, bool]:
    """
    Возвращает (travel_times_list, total_time, feasible)
    """
    time_now = min(s for s,_ in working_times[depot])
    current = depot
    total_time = 0
    travel_times = []

    for node in route[1:]:
        travel_time = int(round(travel[current][node]))
        arrival = time_now + (SERVICE_TIME if current != depot else 0) + travel_time

        # расчет ожидания
        wait = 0
        feasible = False
        for s,e in working_times[node]:
            if arrival <= e:
                wait = max(0, s - arrival)
                feasible = True
                break
        if not feasible:
            return [], 0, False

        leg_time = travel_time + wait + (SERVICE_TIME if node != depot else 0)
        travel_times.append(leg_time)
        total_time += leg_time

        time_now = arrival + wait + (SERVICE_TIME if node != depot else 0)
        current = node

    return travel_times, total_time, True

def solve_routes_all_alternatives(travel_time_matrix: List[List[float]], working_times: List[List[Tuple[int,int]]], depot:int=0, diff_threshold:float=0.10):
    travel = np.array(travel_time_matrix)
    N = travel.shape[0]
    nodes = list(range(N))
    nodes.remove(depot)
    best_total = None
    main_route = None
    main_travel_times = None
    results = []

    for perm in permutations(nodes):
        route = [depot] + list(perm)
        ttimes, total, feasible = route_times(route, travel, working_times, depot)
        if not feasible:
            continue
        if best_total is None or total < best_total:
            best_total = total
            main_route = route
            main_travel_times = ttimes
        results.append((route, ttimes, total))
    if not results:
        print("Невозможно посетить всех клиентов за установленный срок. Пожалуйста, скорректируйте план поездки")
        return []

    # основной маршрут
    final_results = []
    final_results.append(main_route + main_travel_times + [best_total])

    # альтернативные маршруты
    for route, ttimes, total in results:
        if route == main_route:
            continue
        if abs(total - best_total)/best_total <= diff_threshold:
            final_results.append(route + ttimes + [total])

    return final_results

def find_exact_place(client, address):
    try:

        result = client.pelias_search(
            text=address,
            size=1  # Только лучший результат
        )

        if result['features']:
            place = result['features'][0]
            coords = place['geometry']['coordinates']  # [lon, lat]
            full_address = place['properties']['label']

            return coords
        else:
            print(f" Место не найдено: {address}")
            return None

    except Exception as e:
        print(f" Ошибка поиска: {e}")
        return None


# Примеры точного поиска в Ростове

def create_time_matrix(coords, client, profile='driving-car'):
    n = len(coords)
    time_matrix = np.zeros((n, n))

    for i in range(n):
        for j in range(n):
            if i == j:

                time_matrix[i, j] = 0
            else:
                try:

                    route = client.directions(
                        coordinates=[coords[i], coords[j]],
                        profile=profile,
                        format='geojson'
                    )

                    duration = route['features'][0]['properties']['segments'][0]['duration']
                    time_matrix[i, j] = duration

                    time.sleep(0.1)

                except Exception as e:
                    print(f"Ошибка при запросе от {i} к {j}: {e}")
                    time_matrix[i, j] = np.nan

    return time_matrix


def calculate_coordinates(addresses):
    coordinates = []
    for address in addresses:
        coords = find_exact_place(client, address)
        if coords:
            coordinates.append(coords)
    return coordinates


def use_algorithm(coordinates, working_times):
    time_matrix_seconds = create_time_matrix(coordinates, client)
    time_matrix_minutes = ((time_matrix_seconds // 40)).astype(int)
    travel = time_matrix_minutes.tolist()

    result = solve_routes_all_alternatives(travel, working_times, depot=0, diff_threshold=0.10)

    # index = f([r[-1] for r in result])
    # print([r[-1] for r in result])
    # print(f([1.0, 2.0, 3.0]))

    out = [(r[:len(coordinates)], r[len(coordinates):-1], r[-1]) for r in result]

    return out


if __name__=="__main__":
    out = use_algorithm(calculate_coordinates(example_addresses), example_working_times)

    if out:
        for i, r in enumerate(out, start=1):
            print(f"Маршрут {i}: {r[0]}")
    else:
        print("Не удалось найти допустимые маршруты.")
