from fastapi.testclient import TestClient


def test_create_then_list_returns_task(client: TestClient) -> None:
    resp = client.post("/tasks", json={"title": "Write tests"})
    assert resp.status_code == 201
    created = resp.json()
    assert created["title"] == "Write tests"
    assert created["status"] == "todo"
    assert created["id"]
    assert created["created_at"].endswith("Z")

    resp = client.get("/tasks")
    assert resp.status_code == 200
    body = resp.json()
    assert len(body) == 1
    assert body[0]["id"] == created["id"]


def test_create_rejects_empty_title(client: TestClient) -> None:
    resp = client.post("/tasks", json={"title": ""})
    assert resp.status_code == 422


def test_create_rejects_invalid_status(client: TestClient) -> None:
    resp = client.post("/tasks", json={"title": "x", "status": "nope"})
    assert resp.status_code == 422


def test_patch_updates_title_and_status(client: TestClient) -> None:
    created = client.post("/tasks", json={"title": "Draft"}).json()

    resp = client.patch(
        f"/tasks/{created['id']}",
        json={"title": "Final", "status": "in-progress"},
    )
    assert resp.status_code == 200
    updated = resp.json()
    assert updated["title"] == "Final"
    assert updated["status"] == "in-progress"


def test_patch_missing_returns_404(client: TestClient) -> None:
    resp = client.patch("/tasks/does-not-exist", json={"title": "x"})
    assert resp.status_code == 404
    assert "not found" in resp.json()["detail"].lower()


def test_delete_removes_task(client: TestClient) -> None:
    created = client.post("/tasks", json={"title": "Delete me"}).json()

    resp = client.delete(f"/tasks/{created['id']}")
    assert resp.status_code == 204

    listing = client.get("/tasks").json()
    assert all(t["id"] != created["id"] for t in listing)


def test_delete_missing_returns_404(client: TestClient) -> None:
    resp = client.delete("/tasks/does-not-exist")
    assert resp.status_code == 404
